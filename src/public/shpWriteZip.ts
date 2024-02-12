import JSZip from "jszip";
import shpWrite, { Options } from "./shpWrite";
import { FeatureCollection } from "geojson";
import { ShapefileTypesString } from "../private/helpers/shapefileTypes";

type ZipUrl = string;

const shpWriteZip = async (
  filename: string,
  geojson: FeatureCollection,
  type: ShapefileTypesString,
  options?: Partial<Options>,
  download?: boolean,
  wktProjectionString?: string
) => {
  const { shp, shx, dbf } = await shpWrite(geojson, type, options);

  var zip = new JSZip();
  const safeFileName = filename.replace(/[^A-Za-z0-9\-\_]/, "-").replace(/\.zip$/i, "");
  zip.file(safeFileName + ".shp", shp);
  zip.file(safeFileName + ".shx", shx);
  zip.file(safeFileName + ".dbf", dbf);
  if (wktProjectionString) zip.file(safeFileName + ".prj", wktProjectionString);

  const zipBlob = await zip.generateAsync({ type: "blob" });
  if (download) {
    const blobUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.download = filename.slice(-4).toLowerCase() === ".zip" ? filename : filename + ".zip";
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }
  return zipBlob;
};

export default shpWriteZip;
