import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { toShp } from "..";

const buffEqal = (buf1: ArrayBuffer, buf2: ArrayBuffer, ignoreByteIndexes: number[] = []) => {
  if (buf1.byteLength != buf2.byteLength) return false;
  var dv1 = new Int8Array(buf1);
  var dv2 = new Int8Array(buf2);
  for (var i = 0; i != buf1.byteLength; i++) {
    if (dv1[i] != dv2[i] && !ignoreByteIndexes.includes(i)) return false;
  }
  return true;
};
describe("toShp", () => {
  it("PolyLineZ.001 - LineString, default options", () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "eldorado_peak_trail.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "001-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "001-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "001-PolyLineZ.dbf"));

    const { shp, shx, dbf } = toShp(geojson, "PolyLineZ", {
      parseElevationFromThirdElementInFeaturesCoordinateArray: true,
    });
    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLineZ.002 - MultiLineString, default options", () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "mount_shasta_trails_multiLineString.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "002-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "002-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "002-PolyLineZ.dbf"));

    const { shp, shx, dbf } = toShp(geojson, "PolyLineZ", {
      parseElevationFromThirdElementInFeaturesCoordinateArray: true,
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLineZ.003 - MultiLineString, elevation from feature property", () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "mount_shasta_trails_multiLineString.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "003-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "003-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "003-PolyLineZ.dbf"));

    const { shp, shx, dbf } = toShp(geojson, "PolyLineZ", {
      featureElevationPropertyKey: "singularNumberForTest",
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLineZ.004 - MultiLineString, elevation array from feature properties", () => {
    const geojson = JSON.parse(
      fs.readFileSync(path.join(__dirname, "assets", "mount_shasta_trails_multiLineString.json"), { encoding: "UTF-8" })
    );
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "004-PolyLineZ.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "004-PolyLineZ.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "PolyLineZ", "004-PolyLineZ.dbf"));

    const { shp, shx, dbf } = toShp(geojson, "PolyLineZ", {
      featureElevationPropertyKey: "elevationAsProperty",
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });
});
