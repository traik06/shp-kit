import { describe, expect, it } from "vitest";
import flattenGeojsonFeatureListToSimpleCoordinateList from "./flattenGeojsonFeatureCoordinates";

describe("flattenGeojsonFeatureListToSimpleCoordinateList", () => {
  it("should flatten a flat array of Point coordinates", () => {
    const features = [
      { geometry: { type: "Point", coordinates: [1, 2] } },
      { geometry: { type: "Point", coordinates: [3, 4] } },
    ];
    const result = flattenGeojsonFeatureListToSimpleCoordinateList(features as any);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("should flatten an array of LineString coordinates", () => {
    const features = [
      {
        geometry: {
          type: "LineString",
          coordinates: [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
        },
      },
      {
        geometry: {
          type: "LineString",
          coordinates: [
            [7, 8],
            [9, 10],
          ],
        },
      },
    ];
    const result = flattenGeojsonFeatureListToSimpleCoordinateList(features as any);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
  });

  it("should flatten mixed geometries", () => {
    const features = [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0],
        },
        properties: {
          name: "Point Feature",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [1, 1],
            [2, 2],
            [3, 3],
          ],
        },
        properties: {
          name: "LineString Feature",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
            [
              [0.2, 0.2],
              [0.8, 0.2],
              [0.8, 0.8],
              [0.2, 0.8],
              [0.2, 0.2],
            ],
          ],
        },
        properties: {
          name: "Polygon Feature with Hole",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "MultiPoint",
          coordinates: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
        properties: {
          name: "MultiPoint Feature",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "MultiLineString",
          coordinates: [
            [
              [0, 0],
              [1, 1],
              [2, 2],
            ],
            [
              [3, 3],
              [4, 4],
              [5, 5],
            ],
          ],
        },
        properties: {
          name: "MultiLineString Feature",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "MultiPolygon",
          coordinates: [
            [
              [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
                [0, 0],
              ],
              [
                [0.2, 0.2],
                [0.8, 0.2],
                [0.8, 0.8],
                [0.2, 0.8],
                [0.2, 0.2],
              ],
            ],
            [
              [
                [2, 2],
                [3, 2],
                [3, 3],
                [2, 3],
                [2, 2],
              ],
            ],
          ],
        },
        properties: {
          name: "MultiPolygon Feature with Hole",
        },
      },
    ];
    const result = flattenGeojsonFeatureListToSimpleCoordinateList(features as any);
    expect(result).toEqual([
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
      [0.2, 0.2],
      [0.8, 0.2],
      [0.8, 0.8],
      [0.2, 0.8],
      [0.2, 0.2],
      [0, 0],
      [1, 1],
      [2, 2],
      [0, 0],
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [0.2, 0.2],
      [0.8, 0.2],
      [0.8, 0.8],
      [0.2, 0.8],
      [0.2, 0.2],
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
      [2, 2],
      [3, 2],
      [3, 3],
      [2, 3],
      [2, 2],
    ]);
  });
});
