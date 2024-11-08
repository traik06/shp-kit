import * as PolyLineWriter from "./PolyLine";
import * as PointWriter from "./Point";

const writers = {
  // 0 : "Null Shape",
  1: PointWriter,
  3: PolyLineWriter, //"PolyLine",
  // 5: "Polygon",
  // 8: "MultiPoint",
  11: PointWriter,
  13: PolyLineWriter, //"PolyLineZ",
  15: PolyLineWriter,
  // 18: "MultiPointZ",
  21: PointWriter,
  23: PolyLineWriter, //"PolyLineM",
  // 25: "PolygonM",
  // 28: "MultiPointM",
  // 31 : "MultiPatch",
} as const;

export { default as dbf } from "./Dbf";
export default writers;