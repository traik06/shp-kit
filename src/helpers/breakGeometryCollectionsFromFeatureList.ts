import {
  Feature,
  GeoJsonProperties,
  Point,
  MultiPoint,
  LineString,
  MultiLineString,
  Polygon,
  MultiPolygon,
  Geometry,
} from "geojson";

type FeatureWOGeometryCollection = Feature<
  Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon,
  GeoJsonProperties
>;

const breakGeometryCollectionsFromFeatureList = (features: Feature<Geometry, GeoJsonProperties>[]) => {
  return features.reduce((list, feature) => {
    if (feature.geometry.type === "GeometryCollection") {
      return list.concat(
        feature.geometry.geometries.map((g) => {
          return { ...feature, geometry: g };
        }) as FeatureWOGeometryCollection[]
      );
    }
    return list.concat([feature as FeatureWOGeometryCollection]);
  }, [] as FeatureWOGeometryCollection[]);
};

export default breakGeometryCollectionsFromFeatureList;
