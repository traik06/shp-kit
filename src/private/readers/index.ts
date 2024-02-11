import PolyLineReader from "./PolyLine";
import PointReader from "./Point";

const readers = {
  // 0 : "Null Shape",
  1: PointReader, // "Point",
  3: PolyLineReader, // "PolyLine",
  // 5: "Polygon",
  // 8: "MultiPoint",
  11: PointReader, // "PointZ",
  13: PolyLineReader, // "PolyLineZ",
  // 15: "PolygonZ",
  // 18: "MultiPointZ",
  21: PointReader, // "PointM",
  23: PolyLineReader, // "PolyLineM",
  // 25: "PolygonM",
  // 28: "MultiPointM",
  // 31 : "MultiPatch",
} as const;

export { default as dbf } from "./Dbf";
export default readers;
