import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { ShapefileTypesNumber, shapefileNumberTypeToStringType } from "../helpers/shapefileTypes";
import { Options } from "../../public/shpWrite";
import boundingBoxFromFeaturesList from "../helpers/boundingBoxFromCoordinateList";
import flattenGeojsonFeatureListToSimpleCoordinateList from "../helpers/flattenGeojsonFeatureCoordinates";
import breakGeometryCollectionsFromFeatureList from "../helpers/breakGeometryCollectionsFromFeatureList";

const extents = boundingBoxFromFeaturesList;

const filterFeatures = (geojson: FeatureCollection, o: Options) => {
  const features = breakGeometryCollectionsFromFeatureList(geojson.features).filter((f) => {
    return f.geometry.type === "Point" || (o.bundleMultiTypes && f.geometry.type === "MultiPoint");
  });
  return features as Feature<Geometry, GeoJsonProperties>[];
};

const shpLength = (
  features: Feature<Geometry, GeoJsonProperties>[],
  shpTypeNumber: ShapefileTypesNumber,
  o: Options
) => {
  const typeString = shapefileNumberTypeToStringType(shpTypeNumber);
  const coordinates = flattenGeojsonFeatureListToSimpleCoordinateList(features);
  const file_header_length_bytes = 100;
  const records_header_length_bytes = coordinates.length * 8; // 4 bytes feature number, 4 bytes feature length
  let points_record_length_bytes = coordinates.length * 20; // 8 bytes x + 8 bytes y + 4 bytes shapeType
  if (typeString === "PointM") points_record_length_bytes += coordinates.length * 8;
  if (typeString === "PointZ") points_record_length_bytes += coordinates.length * 16;
  return file_header_length_bytes + records_header_length_bytes + points_record_length_bytes;
};

const shxLength = (
  features: Feature<Geometry, GeoJsonProperties>[],
  shpTypeNumber: ShapefileTypesNumber,
  o: Options
) => {
  const coordinates = flattenGeojsonFeatureListToSimpleCoordinateList(features);
  const file_header_length_bytes = 100;
  const records_length_bytes = coordinates.length * 8;
  return file_header_length_bytes + records_length_bytes;
};

const write = (
  shpView: DataView,
  shxView: DataView,
  features: Feature<Geometry, GeoJsonProperties>[],
  shpTypeNumber: ShapefileTypesNumber,
  o: Options
) => {
  let currByteIndex = 100;
  let record_index = 1;
  const shpType = shapefileNumberTypeToStringType(shpTypeNumber);

  features.forEach((feature, index) => {
    const coordinates = flattenGeojsonFeatureListToSimpleCoordinateList([feature]);
    coordinates.forEach((coords, coord_index) => {
      const [x, y, z] = coords;

      shpView.setInt32(currByteIndex + 8, shpTypeNumber, true);
      shpView.setFloat64(currByteIndex + 12, x, true);
      shpView.setFloat64(currByteIndex + 20, y, true);

      // PointM start
      if (shpType === "PointM") {
        if (o.measurePropertyKey) {
          let mValue = feature.properties?.[o.elevationPropertyKey as string];
          if (typeof mValue === "string" && isFinite(mValue as any)) mValue = Number(mValue);

          if (typeof mValue === "number") {
            shpView.setFloat64(currByteIndex + 28, mValue, true);
          }

          if (Array.isArray(mValue) && typeof mValue[coord_index] !== "undefined") {
            let val = mValue[coord_index];
            if (typeof val === "string" && isFinite(val as any)) val = Number(val);
            if (typeof val === "number") shpView.setFloat64(currByteIndex + 28, val, true);
          }
        }
      }
      // PointM end

      // PointZ start
      if (shpType === "PointZ") {
        if (o.elevationPropertyKey) {
          let zValue = feature.properties?.[o.elevationPropertyKey as string];
          if (typeof zValue === "string" && isFinite(zValue as any)) zValue = Number(zValue);

          if (typeof zValue === "number") {
            shpView.setFloat64(currByteIndex + 28, zValue, true);
          }

          if (Array.isArray(zValue) && typeof zValue[coord_index] !== "undefined") {
            let val = zValue[coord_index];
            if (typeof val === "string" && isFinite(val as any)) val = Number(val);
            if (typeof val === "number") shpView.setFloat64(currByteIndex + 28, val, true);
          }
        } else {
          shpView.setFloat64(currByteIndex + 28, z || 0, true);
        }

        if (o.measurePropertyKey) {
          let mValue = feature.properties?.[o.elevationPropertyKey as string];
          if (typeof mValue === "string" && isFinite(mValue as any)) mValue = Number(mValue);

          if (typeof mValue === "number") {
            shpView.setFloat64(currByteIndex + 36, mValue, true);
          }

          if (Array.isArray(mValue) && typeof mValue[coord_index] !== "undefined") {
            let val = mValue[coord_index];
            if (typeof val === "string" && isFinite(val as any)) val = Number(val);
            if (typeof val === "number") shpView.setFloat64(currByteIndex + 36, val, true);
          }
        }
      }
      // PointZ end

      const featureLength = shpType === "Point" ? 20 : shpType === "PointM" ? 28 : 36; // PointZ 44;
      // Record header
      shpView.setInt32(currByteIndex, record_index++); // Record number
      shpView.setInt32(currByteIndex + 4, featureLength / 2); // Record length

      //Shx
      shxView.setInt32(100 + index * 8, currByteIndex / 2); // Offset
      shxView.setInt32(100 + index * 8 + 4, featureLength / 2); // Content length

      currByteIndex += featureLength + 8;
    });
  });
};

const dbfProps = (
  features: Feature<Geometry, GeoJsonProperties>[],
  shpTypeNumber: ShapefileTypesNumber,
  o: Options
) => {
  let props: any, prop;
  const propList = features.reduce((list, f) => {
    const coordinates = flattenGeojsonFeatureListToSimpleCoordinateList([f]);
    props = {};
    Object.keys(f.properties || []).forEach((key) => {
      prop = (f.properties as any)[key];
      if (typeof prop !== "undefined") {
        props[key] = prop;
      }
    });
    for (let i = 0; i < coordinates.length; i++) list.push(props);

    return list;
  }, [] as { [key: string]: string | number | boolean }[]);
  return propList;
};

export { write, extents, shpLength, shxLength, filterFeatures, dbfProps };
