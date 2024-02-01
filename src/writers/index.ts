import * as PolyLineWriter from "./PolyLine";

const writers = {
  // 0 : "Null Shape",
  // 1: "Point",
  3: PolyLineWriter,
  // 5: "Polygon",
  // 8: "MultiPoint",
  // 11: "PointZ",
  // 13: "PolyLineZ",
  // 15: "PolygonZ",
  // 18: "MultiPointZ",
  // 21: "PointM",
  // 23: "PolyLineM",
  // 25: "PolygonM",
  // 28: "MultiPointM",
  // 31 : "MultiPatch",
} as const;

export default writers;
