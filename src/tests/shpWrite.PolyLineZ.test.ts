import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { shpWrite } from "..";

const buffEqal = (buf1: ArrayBuffer, buf2: ArrayBuffer, ignoreByteIndexes: number[] = []) => {
  if (buf1.byteLength != buf2.byteLength) return false;
  var dv1 = new Int8Array(buf1);
  var dv2 = new Int8Array(buf2);
  for (var i = 0; i != buf1.byteLength; i++) {
    if (dv1[i] != dv2[i] && !ignoreByteIndexes.includes(i)) return false;
  }
  return true;
};
describe("shpWrite", () => {
  it("PolyLineZ.001 - LineString, default options", async () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "eldorado_peak_trail.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "001-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "001-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "001-PolyLineZ.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLineZ", {
      parseElevationFromThirdElementInFeaturesCoordinateArray: true,
    });
    // fs.writeFile(path.join(__dirname, "output", "001-PolyLineZ.shp"), shp, () => {});
    // fs.writeFile(path.join(__dirname, "output", "001-PolyLineZ.shx"), shx, () => {});
    // fs.writeFile(path.join(__dirname, "output", "001-PolyLineZ.dbf"), dbf, () => {});

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLineZ.002 - MultiLineString, default options", async () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "mount_shasta_trails_multiLineString.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "002-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "002-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "002-PolyLineZ.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLineZ", {
      parseElevationFromThirdElementInFeaturesCoordinateArray: true,
    });
    // fs.writeFile(path.join(__dirname, "output", "002-PolyLineZ.shp"), shp, () => {});
    // fs.writeFile(path.join(__dirname, "output", "002-PolyLineZ.shx"), shx, () => {});
    // fs.writeFile(path.join(__dirname, "output", "002-PolyLineZ.dbf"), dbf, () => {});

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLineZ.003 - MultiLineString, elevation from feature property", async () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "mount_shasta_trails_multiLineString.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "003-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "003-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "003-PolyLineZ.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLineZ", {
      featureElevationPropertyKey: "singularNumberForTest",
    });
    // fs.writeFile(path.join(__dirname, "output", "003-PolyLineZ.shp"), shp, () => {});
    // fs.writeFile(path.join(__dirname, "output", "003-PolyLineZ.shx"), shx, () => {});
    // fs.writeFile(path.join(__dirname, "output", "003-PolyLineZ.dbf"), dbf, () => {});

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLineZ.004 - MultiLineString, elevation array from feature properties", async () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "mount_shasta_trails_multiLineString.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "004-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "004-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLineZ", "004-PolyLineZ.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLineZ", {
      featureElevationPropertyKey: "elevationAsProperty",
    });
    // fs.writeFile(path.join(__dirname, "output", "004-PolyLineZ.shp"), shp, () => {});
    // fs.writeFile(path.join(__dirname, "output", "004-PolyLineZ.shx"), shx, () => {});
    // fs.writeFile(path.join(__dirname, "output", "004-PolyLineZ.dbf"), dbf, () => {});

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });
});
