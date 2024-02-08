import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Options } from "../public/shpWrite";
import flattenGeojsonFeatureListToSimpleCoordinateList from "./flattenGeojsonFeatureCoordinates";
import { ShapefileTypesNumber, shapefileNumberTypeToStringType } from "./shapefileTypes";

const boundingBoxFromFeaturesList = (
  features: Feature<Geometry, GeoJsonProperties>[],
  shpTypeNumber: ShapefileTypesNumber,
  o: Partial<Options>
) => {
  const coordinateList = flattenGeojsonFeatureListToSimpleCoordinateList(features);
  const type = shapefileNumberTypeToStringType(shpTypeNumber);
  const bb = {
    xmin: Infinity,
    xmax: -Infinity,
    ymin: Infinity,
    ymax: -Infinity,
  } as {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
    zmin?: number;
    zmax?: number;
    mmin?: number;
    mmax?: number;
  };
  if (type[type.length - 1] === "Z" || type[type.length - 1] === "M") {
    bb.mmin = Infinity;
    bb.mmax = -Infinity;
  }
  if (type[type.length - 1] === "Z") {
    bb.zmin = Infinity;
    bb.zmax = -Infinity;
  }

  coordinateList.forEach((c) => {
    bb.xmin = Math.min(c[0], bb.xmin);
    bb.xmax = Math.max(c[0], bb.xmax);
    bb.ymin = Math.min(c[1], bb.ymin);
    bb.ymax = Math.max(c[1], bb.ymax);
    if (typeof c[2] === "number" && !o.elevationPropertyKey) {
      bb.zmax = Math.max(c[2], bb.zmax || -Infinity);
      bb.zmin = Math.min(c[2], bb.zmin || Infinity);
    }
  });

  let z, m;
  features.forEach((f) => {
    if (o.elevationPropertyKey) {
      z = (f.properties as any)[o.elevationPropertyKey];
      if (typeof z === "number") {
        bb.zmax = Math.max(z, bb.zmax || -Infinity);
        bb.zmin = Math.min(z, bb.zmin || Infinity);
      }
    }
    if (o.measurePropertyKey) {
      m = (f.properties as any)[o.measurePropertyKey];
      if (typeof m === "number") {
        bb.mmax = Math.max(m, bb.mmax || -Infinity);
        bb.mmin = Math.min(m, bb.mmin || Infinity);
      }
    }
  });

  if (bb.mmin === Infinity) bb.mmin = 0;
  if (bb.mmax === -Infinity) bb.mmax = 0;

  if (bb.zmin === Infinity) bb.zmin = 0;
  if (bb.zmax === -Infinity) bb.zmax = 0;

  return bb;
};

export default boundingBoxFromFeaturesList;
