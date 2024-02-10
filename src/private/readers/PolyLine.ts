import { Feature } from "geojson";
import { ShapefileTypesNumber, ShapefileTypesString } from "../helpers/shapefileTypes";
import { Options } from "../../public/shpRead";

const getOptionalViewFloat64 = (view: DataView, target: number, little: boolean) => {
  if (target > view.byteLength - 1) return 0;
  return view.getFloat64(target, little);
};

const PolyLine = (
  shpView: DataView,
  o: Options,
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

  let points = [...Array(pointsLength)].map((_, i) => {
    return [shpView.getFloat64(currByteIndex + 16 * i, true), shpView.getFloat64(currByteIndex + 16 * i + 8, true)];
  });

  currByteIndex += 16 * pointsLength;

  let mValues: number[] | null = null;
  let zValues: number[] | null = null;
  if (shpType === "PolyLineM") {
    currByteIndex += 32; // min-max
    mValues = [...Array(pointsLength)].map((_, i) => {
      return shpView.getFloat64(currByteIndex + 8 * i, true);
    });
  }
  if (shpType === "PolyLineZ") {
    currByteIndex += 16; // min-max
    zValues = [...Array(pointsLength)].map((_, i) => {
      return getOptionalViewFloat64(shpView, currByteIndex + 8 * i, true);
      return shpView.getFloat64(currByteIndex + 8 * i, true);
    });
    currByteIndex += pointsLength * 8 + 16;
    mValues = [...Array(pointsLength)].map((_, i) => {
      return getOptionalViewFloat64(shpView, currByteIndex + 8 * i, true);
      return shpView.getFloat64(currByteIndex + 8 * i, true);
    });

    if (!o.elevationPropertyKey) {
      points = points.map((pt, i) => [pt[0] as number, pt[1] as number, (zValues as number[])[i] as number]);
    }
  }

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
    properties: {
      ...properties,
      ...(o.elevationPropertyKey && zValues
        ? {
            [o.elevationPropertyKey]: zValues && [...new Set(zValues)].length === 1 ? zValues[0] : zValues,
          }
        : {}),
      ...(o.measurePropertyKey && mValues
        ? {
            [o.measurePropertyKey]: mValues && [...new Set(mValues)].length === 1 ? mValues[0] : mValues,
          }
        : {}),
    },
  } as Feature;
  //   return partsSeparators;
  return output as Feature;
};

export default PolyLine;
