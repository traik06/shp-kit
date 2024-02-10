import { describe, expect, it } from "vitest";
import breakGeometryCollectionsFromFeatureList from "./breakGeometryCollectionsFromFeatureList";

describe("breakGeometryCollectionsFromFeatureList", () => {
  it("should break geometry collection correctly", () => {
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
          type: "GeometryCollection",
          geometries: [
            {
              type: "Point",
              coordinates: [4, 4],
            },
            {
              type: "LineString",
              coordinates: [
                [5, 5],
                [6, 6],
                [7, 7],
              ],
            },
          ],
        },
        properties: {
          name: "GeometryCollection Feature",
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
    const result = breakGeometryCollectionsFromFeatureList(features as any);
    expect(result).toEqual([
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
          type: "Point",
          coordinates: [4, 4],
        },
        properties: {
          name: "GeometryCollection Feature",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [5, 5],
            [6, 6],
            [7, 7],
          ],
        },
        properties: {
          name: "GeometryCollection Feature",
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
    ]);
  });
});
