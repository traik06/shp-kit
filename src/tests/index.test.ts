import { describe, expect, it } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { toShp } from "..";

const buffEqal = (buf1: ArrayBuffer, buf2: ArrayBuffer) => {
  if (buf1.byteLength != buf2.byteLength) return false;
  var dv1 = new Int8Array(buf1);
  var dv2 = new Int8Array(buf2);
  for (var i = 0; i != buf1.byteLength; i++) {
    if (dv1[i] != dv2[i]) return false;
  }
  return true;
};
describe("toShp", () => {
  it("001 - Generate PolyLine shapefile with default options", () => {
    const geojson = JSON.parse(fs.readFileSync(path.join(__dirname, "assets", "example.json"), { encoding: "UTF-8" }));
    const shpBuffer = fs.readFileSync(path.join(__dirname, "test_results", "001.PolyLine.shp"));
    const shxBuffer = fs.readFileSync(path.join(__dirname, "test_results", "001.PolyLine.shx"));
    const dbfBuffer = fs.readFileSync(path.join(__dirname, "test_results", "001.PolyLine.dbf"));

    // Only default options tested
    const { shp, shx, dbf } = toShp(geojson, "PolyLine");
    expect(buffEqal(shpBuffer, shp.buffer)).toBe(true);
    expect(buffEqal(shxBuffer, shx.buffer)).toBe(true);
    expect(buffEqal(dbfBuffer, dbf.buffer)).toBe(true);

    // fs.writeFile(path.join(__dirname, "output", "example.shp"), shp, () => {});
    // fs.writeFile(path.join(__dirname, "output", "example.shx"), shx, () => {});
    // fs.writeFile(path.join(__dirname, "output", "example.dbf"), dbf, () => {});
  });
});
