const shapefileTypes = {
  0: "Null Shape",
  1: "Point",
  3: "PolyLine",
  5: "Polygon",
  8: "MultiPoint",
  11: "PointZ",
  13: "PolyLineZ",
  15: "PolygonZ",
  18: "MultiPointZ",
  21: "PointM",
  23: "PolyLineM",
  25: "PolygonM",
  28: "MultiPointM",
  31: "MultiPatch",
} as const;

type ShapefileTypesNumber = keyof typeof shapefileTypes;
type ShapefileTypesString = (typeof shapefileTypes)[ShapefileTypesNumber];

const shapefileTypeToNumberType = (type: (typeof shapefileTypes)[keyof typeof shapefileTypes]) => {
  const numType = Object.keys(shapefileTypes)
    .map((_) => Number(_) as keyof typeof shapefileTypes)
    .find((key) => shapefileTypes[key] === type);
  return typeof numType === "number" ? numType : null;
};

const shapefileNumberTypeToStringType = (numType: keyof typeof shapefileTypes) => {
  return shapefileTypes[numType];
};

export default shapefileTypes;
export { shapefileTypeToNumberType, shapefileNumberTypeToStringType };
export type { ShapefileTypesString, ShapefileTypesNumber };
