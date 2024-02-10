import { describe, expect, it } from "vitest";
import boundingBoxFromFeaturesList from "./boundingBoxFromCoordinateList";

describe("boundingBoxFromFeaturesList", () => {
  it("should calculate bounding box from a list of Point features", () => {
    const features = [
      { geometry: { type: "Point", coordinates: [1, 2, 3] }, properties: {} },
      { geometry: { type: "Point", coordinates: [4, 5, 6] }, properties: {} },
      { geometry: { type: "Point", coordinates: [7, 8, 9] }, properties: {} },
    ];

    const shpTypeNumber = 1;
    const options = {};

    const result = boundingBoxFromFeaturesList(features as any, shpTypeNumber, options);

    expect(result).toMatchObject({
      xmin: 1,
      ymin: 2,
      xmax: 7,
      ymax: 8,
    });
  });

  it("should calculate bounding box from a list of Point features", () => {
    const features = [
      { geometry: { type: "Point", coordinates: [1, 2, 3] }, properties: {} },
      { geometry: { type: "Point", coordinates: [4, 5, 6] }, properties: {} },
      { geometry: { type: "Point", coordinates: [7, 8, 9] }, properties: {} },
    ];

    const shpTypeNumber = 11; // Assuming Point type with elevation PointZ
    const options = {};

    const result = boundingBoxFromFeaturesList(features as any, shpTypeNumber, options);

    expect(result).toMatchObject({
      xmin: 1,
      ymin: 2,
      xmax: 7,
      ymax: 8,
      zmin: 3,
      zmax: 9,
    });
  });

  // Add more test cases based on different feature types, options, and scenarios

  // Note: Adjust the test cases based on the actual behavior and expected results of your function.
});
