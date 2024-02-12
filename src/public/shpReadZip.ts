import JSZip from "jszip";
import shpRead, { Options } from "./shpRead";

type ZipUrl = string;

const shpReadZip = async (file: File | Blob | ZipUrl, options?: Partial<Options>) => {
  if (typeof file === "string") {
    const response = await fetch(file);
    if (!response.ok) {
      throw new Error(`Failed to download ZIP from URL. Status: ${response.status}`);
    }
    file = await response.blob();
  }

  const zip = new JSZip();
  await zip.loadAsync(file);
  const files = zip.file(/.+/);

  const shp = await files.find((f) => f.name.slice(-3).toLowerCase() === "shp")?.async("arraybuffer");
  const dbf = await files.find((f) => f.name.slice(-3).toLowerCase() === "dbf")?.async("arraybuffer");
  const prj = await files.find((f) => f.name.slice(-3).toLowerCase() === "prj")?.async("text");

  if (!shp) throw new Error(`No *.shp file was found within the provided *.zip file.`);

  const geojson = await shpRead(shp, options, dbf, prj);
  return geojson;
};

export default shpReadZip;
