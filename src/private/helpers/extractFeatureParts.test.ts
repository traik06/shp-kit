import { describe, expect, it } from "vitest";
import extractFeatureParts from "./extractFeatureParts";

describe("breakGeometryCollectionsFromFeatureList", () => {
  it("Extract parts from a Point feature", () => {
    const feature = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [0, 0],
      },
      properties: {
        name: "Point Feature",
      },
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([[[0, 0]]]);
  });

  it("Extract parts from a LineString feature", () => {
    const feature = {
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
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([
      [
        [1, 1],
        [2, 2],
        [3, 3],
      ],
    ]);
  });

  it("Extract parts from a GeometryCollection feature", () => {
    const feature = {
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
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([
      [[4, 4]],
      [
        [5, 5],
        [6, 6],
        [7, 7],
      ],
    ]);
  });

  it("Extract parts from a Polygon feature", () => {
    const feature = {
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
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([
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
    ]);
  });

  it("Extract parts from a MultiPoint feature", () => {
    const feature = {
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
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ],
    ]);
  });

  it("Extract parts from a MultiLineString feature", () => {
    const feature = {
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
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([
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
    ]);
  });

  it("Extract parts from a MultiPolygon feature", () => {
    const feature = {
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
          [
            [
              [10, 0],
              [11, 0],
              [11, 1],
              [10, 1],
              [10, 0],
            ],
            [
              [10.2, 0.2],
              [10.8, 0.2],
              [10.8, 0.8],
              [10.2, 0.8],
              [10.2, 0.2],
            ],
          ],
          [
            [
              [12, 2],
              [13, 2],
              [13, 3],
              [12, 3],
              [12, 2],
            ],
          ],
        ],
      },
      properties: {
        name: "MultiPolygon Feature with Hole",
      },
    };
    const result = extractFeatureParts(feature as any);
    expect(result).toEqual([
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
      [
        [2, 2],
        [3, 2],
        [3, 3],
        [2, 3],
        [2, 2],
      ],
      [
        [10, 0],
        [11, 0],
        [11, 1],
        [10, 1],
        [10, 0],
      ],
      [
        [10.2, 0.2],
        [10.8, 0.2],
        [10.8, 0.8],
        [10.2, 0.8],
        [10.2, 0.2],
      ],
      [
        [12, 2],
        [13, 2],
        [13, 3],
        [12, 3],
        [12, 2],
      ],
    ]);
  });
});
