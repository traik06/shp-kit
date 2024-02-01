import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { ShapefileTypesNumber, shapefileNumberTypeToStringType } from "../helpers/shapefileTypes";
import { Options } from "../public/toShp";
import boundingBoxFromFeaturesList from "../helpers/boundingBoxFromCoordinateList";
import flattenGeojsonFeatureListToSimpleCoordinateList from "../helpers/flattenGeojsonFeatureCoordinates";
import extractFeatureParts from "../helpers/extractFeatureParts";
import breakGeometryCollectionsFromFeatureList from "../helpers/breakGeometryCollectionsFromFeatureList";

const extents = boundingBoxFromFeaturesList;

const filterFeatures = (geojson: FeatureCollection, o: Options) => {
  const features = breakGeometryCollectionsFromFeatureList(geojson.features).filter((f) => {
    return (
      f.geometry.type === "LineString" ||
      (o.bundlePolygonsWithLineStrings && f.geometry.type === "Polygon") ||
      (o.bundleMultiTypesWithBasic && f.geometry.type === "MultiLineString") ||
      (o.bundleMultiTypesWithBasic && o.bundlePolygonsWithLineStrings && f.geometry.type === "MultiPolygon")
    );
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
  const parts = features.map((f) => extractFeatureParts(f).length).reduce((a, b) => a + b, 0);
  const file_header_length_bytes = 100;
  const records_header_length_bytes = features.length * 8;
  let polyline_record_length_bytes = 44 * features.length + parts * 4 + coordinates.length * 16;
  if (typeString === "PolyLineM") polyline_record_length_bytes += 16 + coordinates.length * 8;
  if (typeString === "PolyLineZ") polyline_record_length_bytes += 32 + coordinates.length * 16;
  return file_header_length_bytes + records_header_length_bytes + polyline_record_length_bytes;
};

const shxLength = (
  features: Feature<Geometry, GeoJsonProperties>[],
  shpTypeNumber: ShapefileTypesNumber,
  o: Options
) => {
  const file_header_length_bytes = 100;
  const records_length_bytes = features.length * 8;
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

  features.forEach((feature, index) => {
    let featureByteIndex = 8;
    const parts = extractFeatureParts(feature);
    const points = flattenGeojsonFeatureListToSimpleCoordinateList([feature]);
    const bb = boundingBoxFromFeaturesList([feature], shpTypeNumber, o);

    shpView.setInt32(currByteIndex + featureByteIndex + 0, shpTypeNumber, true);

    shpView.setFloat64(currByteIndex + featureByteIndex + 4, bb.xmin, true);
    shpView.setFloat64(currByteIndex + featureByteIndex + 12, bb.ymin, true);
    shpView.setFloat64(currByteIndex + featureByteIndex + 20, bb.xmax, true);
    shpView.setFloat64(currByteIndex + featureByteIndex + 28, bb.ymax, true);

    shpView.setInt32(currByteIndex + featureByteIndex + 36, parts.length, true);
    shpView.setInt32(currByteIndex + featureByteIndex + 40, points.length, true);

    featureByteIndex += 44;

    // mark each part with the first point index in given part
    parts
      .map((_, i) => parts.reduce((a, b, j) => (i > j ? a + b.length : a), 0))
      .forEach((part) => {
        shpView.setInt32(currByteIndex + featureByteIndex, part, true);
        featureByteIndex += 4;
      });

    points.forEach((point) => {
      shpView.setFloat64(currByteIndex + featureByteIndex, point[0], true);
      shpView.setFloat64(currByteIndex + featureByteIndex + 8, point[1], true);
      featureByteIndex += 16;
    });

    // Record header
    shpView.setInt32(currByteIndex, index + 1); // Record number
    shpView.setInt32(currByteIndex + 4, (featureByteIndex - 8) / 2); // Record length

    //Shx
    shxView.setInt32(100 + index * 8, currByteIndex / 2); // Offset
    shxView.setInt32(100 + index * 8 + 4, (featureByteIndex - 8) / 2); // Content length

    currByteIndex += featureByteIndex;
  });
};

export { write, extents, shpLength, shxLength, filterFeatures };
