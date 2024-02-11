import { Feature } from "geojson";
import { ShapefileTypesString } from "../helpers/shapefileTypes";
import { Options } from "../../public/shpRead";

const getOptionalViewFloat64 = (view: DataView, target: number, lastValidByte: number, little: boolean) => {
  if (target > view.byteLength - 1 || target > lastValidByte) return 0;
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
  const recordEndByte = currByteIndex + recordLength;

  const x = shpView.getFloat64(currByteIndex + 4, true);
  const y = shpView.getFloat64(currByteIndex + 12, true);
  let m: number | null = null;
  let z: number | null = null;

  if (shpType === "PointM") {
    m = getOptionalViewFloat64(shpView, currByteIndex + 20, recordEndByte, true);
  }
  if (shpType === "PointZ") {
    z = getOptionalViewFloat64(shpView, currByteIndex + 20, recordEndByte, true);
    m = getOptionalViewFloat64(shpView, currByteIndex + 28, recordEndByte, true);
  }

  const coordinates = [x, y];
  if (!o.elevationPropertyKey && z !== null) {
    coordinates.push(z);
  }

  const output = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: {
      ...properties,
      ...(o.elevationPropertyKey && z !== null
        ? {
            [o.elevationPropertyKey]: z,
          }
        : {}),
      ...(o.measurePropertyKey && m !== null
        ? {
            [o.measurePropertyKey]: m,
          }
        : {}),
    },
  } as Feature;
  return output as Feature;
};

export default PolyLine;
