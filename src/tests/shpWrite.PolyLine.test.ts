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
  it("PolyLine.001 - default options", async () => {
    const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "example.json"), { encoding: "UTF-8" }));
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "001-PolyLine.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "001-PolyLine.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "001-PolyLine.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLine");

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLine.002 - no multi-types", async () => {
    const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "example.json"), { encoding: "UTF-8" }));
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "002-PolyLine.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "002-PolyLine.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "002-PolyLine.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLine", {
      bundleMultiTypesWithBasic: false,
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLine.003 - no polygons parsed as lines", async () => {
    const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "example.json"), { encoding: "UTF-8" }));
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "003-PolyLine.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "003-PolyLine.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "003-PolyLine.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLine", {
      bundlePolygonsWithLineStrings: false,
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLine.004 - no polygons parsed as lines or muli-types", async () => {
    const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "example.json"), { encoding: "UTF-8" }));
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "004-PolyLine.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "004-PolyLine.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "004-PolyLine.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLine", {
      bundleMultiTypesWithBasic: false,
      bundlePolygonsWithLineStrings: false,
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });

  it("PolyLine.005 - additional insignificant invalid options", async () => {
    const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "example.json"), { encoding: "UTF-8" }));
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "001-PolyLine.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "001-PolyLine.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "write", "PolyLine", "001-PolyLine.dbf"));

    const { shp, shx, dbf } = await shpWrite(geojson, "PolyLine", {
      featureElevationPropertyKey: "random", // non-existant
      FeatureMPropertyKey: "letter", // string instead of expected number | number[]
    });

    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer, [1, 2, 3])).toBe(true); // [1,2,3] Indexes of current date, 1. Year -1900, 2. Month index (Starting at 1 for January), 3. Day of month
  });
});
