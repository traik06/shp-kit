import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";

type Position = [number, number] | [number, number, number];

function flattenGeojsonFeatureListToSimpleCoordinateList(features: Feature<Geometry, GeoJsonProperties>[]) {
  const geometries = features.reduce(
    (list, feature) =>
      feature.geometry.type === "GeometryCollection"
        ? list.concat(feature.geometry.geometries)
        : list.concat(feature.geometry),
    [] as Geometry[]
  );
  const coordinates = geometries.reduce(
    (list, g) => list.concat(g.type === "Point" ? [g.coordinates] : (g as any).coordinates) as any,
    [] as Position | Position[] | Position[][] | Position[][][]
  );
  const flat = coordinates.reduce((list, c) => {
    if (typeof c === "number") return list;
    else if (typeof c[0] === "number") return (list as Position[]).concat([c] as any);
    else if (typeof c[0]?.[0] === "number") return (list as Position[]).concat(c as any);
    else if (typeof c[0]?.[0]?.[0] === "number")
      return (list as Position[]).concat(c.reduce((a, b) => (b as any[]).concat(a), [] as any));
    return list;
  }, []);
  return flat as Position[];
}

export default flattenGeojsonFeatureListToSimpleCoordinateList;
