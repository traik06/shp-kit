import { Feature } from "geojson";
import { ShapefileTypesNumber, ShapefileTypesString } from "../helpers/shapefileTypes";

const PolyLine = (
  shpView: DataView,
  currByteIndex: number,
  recordLength: number,
  shpType: ShapefileTypesString,
  properties: {
    [key: string]: any;
  }
) => {
  //significant header information
  const partsLength = shpView.getInt32(currByteIndex + 36, true);
  const pointsLength = shpView.getInt32(currByteIndex + 40, true);
  currByteIndex += 44;
  const partsSeparators = [...Array(partsLength)].map((_, i) => shpView.getInt32(currByteIndex + 4 * i, true));
  partsSeparators.push(pointsLength);

  currByteIndex += 4 * partsLength;

  const points = [...Array(pointsLength)].map((_, i) => {
    return [shpView.getFloat64(currByteIndex + 16 * i, true), shpView.getFloat64(currByteIndex + 16 * i + 8, true)];
  });

  const coordinates =
    partsLength === 1
      ? points
      : partsSeparators.reduce(
          (list, v, i, a) =>
            i === 0
              ? list
              : [...list, [...Array(v - (a[i - 1] as number))].map((_, j) => points[(a[i - 1] as number) + j])],
          [] as any[]
        );

  const output = {
    type: "Feature",
    geometry: {
      type: partsLength === 1 ? "LineString" : "MultiLineString",
      coordinates,
    },
    ...(properties ? { properties } : {}),
  } as Feature;
  //   return partsSeparators;
  return output as Feature;
};

export default PolyLine;
