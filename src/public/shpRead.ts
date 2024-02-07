import { Feature, FeatureCollection } from "geojson";
import createDataView from "../helpers/createDataView";
import toDataView from "../helpers/toDataView";
import readers, { dbf as dbfReader } from "../readers";
import { ShapefileTypesNumber, shapefileNumberTypeToStringType } from "../helpers/shapefileTypes";

const defaultOptions = {};

type Options = typeof defaultOptions;

/**
 *
 * @param shp File, Blob, Buffer or BufferArray of the *.shp
 * @param options
 * @param dbf Optional File, Blob, Buffer or BufferArray of the *.dbf file, this is the shapefile database file and will be used to populate features[].properties
 * @param prj Optional File, Blob, Buffer, BufferArray of the *.prj file, or string projection as WKT string or proj4 string. If present, the shapefile will be reprojected into WGS84 coordinate system, which is default for geojson. If unknown, geojson will use original coordinated without transformation
 * @returns geojson FeatureCollection
 */
const shpRead = async (
  shp: File | Blob | ArrayBuffer | Buffer,
  options: Partial<Options>,
  dbf?: File | Blob | ArrayBuffer | Buffer,
  prj?: File | Blob | ArrayBuffer | Buffer | string
) => {
  const shpView = await toDataView(shp);
  const prjView = prj && typeof prj !== "string" ? await toDataView(prj) : null;

  const prjString =
    typeof prj === "string"
      ? prj
      : typeof prj !== "undefined" && prjView
      ? Buffer.from(prjView?.buffer.slice(0, prjView.buffer.byteLength)).toString("utf-8")
      : null;

  const dbfProps = dbf ? await dbfReader(dbf) : null;

  if (shpView.getInt32(0) !== 9994) throw new Error("Invalid shp file.");

  const shpNumType = shpView.getInt32(32, true) as ShapefileTypesNumber;
  //   const shpType = shapefileNumberTypeToStringType(shpNumType);

  let currByteIndex = 100;
  let currFeatureIndex = 0;

  const output = {
    type: "FeatureCollection",
    features: [],
  } as FeatureCollection;

  while (currByteIndex + 4 < shpView.buffer.byteLength - 1) {
    // const recordNum = shpView.getInt32(currByteIndex); // Record number
    const recordLength = shpView.getInt32(currByteIndex + 4) * 2 + 8; // Record length
    const recordNumType = shpView.getInt32(currByteIndex + 8, true) as ShapefileTypesNumber;
    if (recordLength === 0) break;

    const reader = readers[recordNumType as keyof typeof readers];
    if (!reader) {
      continue;
    }

    const feature = reader(
      shpView,
      currByteIndex + 8,
      recordLength,
      shapefileNumberTypeToStringType(recordNumType),
      dbfProps ? dbfProps[currFeatureIndex] || {} : {}
    );
    output.features.push(feature);
    currFeatureIndex++;
    currByteIndex += recordLength;
  }

  return output;
};

export default shpRead;
