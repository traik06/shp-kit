import { Feature, GeoJsonProperties, Geometry, Polygon, Position } from "geojson";
import breakGeometryCollectionsFromFeatureList from "./breakGeometryCollectionsFromFeatureList";

const extractFeatureParts = (feature: Feature<Geometry, GeoJsonProperties>) => {
  if (feature.geometry.type === "LineString") return [feature.geometry.coordinates];
  if (feature.geometry.type === "MultiLineString") return feature.geometry.coordinates;
  if (feature.geometry.type === "MultiPoint") return [feature.geometry.coordinates];
  if (feature.geometry.type === "Point") return [[feature.geometry.coordinates]];
  if (feature.geometry.type === "Polygon") return feature.geometry.coordinates;
  if (feature.geometry.type === "MultiPolygon")
    return feature.geometry.coordinates.reduce((list, segment) => list.concat(segment), [] as Position[][]);
  if (feature.geometry.type === "GeometryCollection") {
    const features = breakGeometryCollectionsFromFeatureList([feature]);
    const featuresParts = features.map((f) => extractFeatureParts(f) as Position[][]);
    const parts = featuresParts.reduce((list, segment) => list.concat(segment), [] as Position[][]) as Position[][];
    return parts;
  }
  return [] as Position[][];
};

export default extractFeatureParts;
