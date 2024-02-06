import { FeatureCollection } from "geojson";
import createDataView from "../helpers/createDataView";

const defaultOptions = {};

type Options = typeof defaultOptions;

/**
 *
 * @param shp File or Blob of the *.shp
 * @param options
 * @param dbf Optional File or Blob of the *.dbf file, this is the shapefile database file and will be used to populate features[].properties
 * @param prj Optional File or Blob of the *.prj file, or string projection as WKT string or proj4 string. If present, the shapefile will be reprojected into WGS84 coordinate system, which is default for geojson. If unknown, geojson will use original coordinated without transformation
 * @returns geojson FeatureCollection
 */
const shpRead = async (shp: File, options: Partial<Options>, dbf?: File, prj?: File | string) => {
  const buffer = await shp.arrayBuffer();
  const shpView = new DataView(buffer);

  return {} as FeatureCollection;
};

export default shpRead;
