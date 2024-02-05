import type { FeatureCollection } from "geojson";
import createDataView from "../helpers/createDataView";
import { ShapefileTypesString, shapefileTypeToNumberType } from "../helpers/shapefileTypes";
import writers from "../writers";
import { structure } from "dbf";

const defaultOptions = {
  bundlePolygonsWithLineStrings: true,
  bundleMultiTypesWithBasic: true,
  parseElevationFromThirdElementInFeaturesCoordinateArray: true,
  featureElevationPropertyKey: null as null | string,
  FeatureMPropertyKey: null as null | string,
};

const toShp = (geojson: FeatureCollection, type: ShapefileTypesString, userOptions?: Partial<Options>) => {
  const options = { ...defaultOptions, ...userOptions };
  const numType = shapefileTypeToNumberType(type);
  if (!numType) throw new Error("Invalid shapefile type");

  const writer = writers[numType as keyof typeof writers];
  if (!writer) throw new Error("Shapefile type not currently supported");

  const { extents, shpLength, shxLength, filterFeatures, write } = writer;

  const features = filterFeatures(geojson, options);

  const shp = createDataView(shpLength(features, numType, options));
  const shx = createDataView(shxLength(features, numType, options));

  // Headers start
  const staticFileCode = 9994;
  const fileLength = shp.byteLength / 2; // Length of file in 16-bit words
  const shapefileVersion = 1000;
  const bb = extents(features, numType, options);

  shp.setInt32(0, staticFileCode);
  shp.setInt32(24, fileLength);
  shp.setInt32(28, shapefileVersion, true);
  shp.setInt32(32, numType, true);

  shp.setFloat64(36, bb.xmin, true);
  shp.setFloat64(44, bb.ymin, true);
  shp.setFloat64(52, bb.xmax, true);
  shp.setFloat64(60, bb.ymax, true);

  if (typeof bb.zmin == "number" && typeof bb.zmax == "number") {
    shp.setInt32(68, bb.zmin, true);
    shp.setInt32(76, bb.zmax, true);
  }

  if (typeof bb.mmin == "number" && typeof bb.mmax == "number") {
    shp.setInt32(84, bb.mmin, true);
    shp.setInt32(92, bb.mmax, true);
  }

  //Duplicate header to Shx (headers are identical)
  for (let i = 0; i < 100; i++) shx.setUint8(i, shp.getUint8(i));
  shx.setInt32(24, shx.byteLength / 2);
  // Headers end

  write(shp, shx, features, numType, options);

  let props: any, prop;
  const propList = features.map((f) => {
    props = {};
    Object.keys(f.properties || []).forEach((key) => {
      prop = (f.properties as any)[key];
      if (typeof prop !== "undefined") {
        props[key] = prop;
      }
    });
    return { ...props };
  });
  const dbf = structure(propList);

  return {
    shp,
    shx,
    dbf,
  };
};

export type Options = typeof defaultOptions;
export default toShp;
