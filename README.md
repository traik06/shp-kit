# shp-kit

**shp-kit** is a JavaScript library under development, providing functionality to read and write shapefiles from GeoJSON. The library focuses on simplifying the conversion process between GeoJSON and shapefiles, making it easier for developers to work with spatial data.

## Shapefile Types Support

The following table outlines the current support for different types of shapefiles in the library:

| Shapefile Type | Read | Write |
| -------------- | ---- | ----- |
| Point          | ❌   | ❌    |
| PolyLine       | ❌   | ✅    |
| Polygon        | ❌   | ❌    |
| MultiPoint     | ❌   | ❌    |
| PointZ         | ❌   | ❌    |
| PolyLineZ      | ❌   | ✅    |
| PolygonZ       | ❌   | ❌    |
| MultiPointZ    | ❌   | ❌    |
| PointM         | ❌   | ❌    |
| PolyLineM      | ❌   | ✅    |
| PolygonM       | ❌   | ❌    |
| MultiPointM    | ❌   | ❌    |
| MultiPatch     | ❌   | ❌    |

Please note that the API specified below may change without notice before reaching v1.0.0

## Library Functions

### toShp

```typescript
toShp: (
	geojson: FeatureCollection,
	type: "Null Shape" | "Point" | "PolyLine" | "Polygon" | "MultiPoint" | "PointZ" | "PolyLineZ" | "PolygonZ" | "MultiPointZ" | "PointM" | "PolyLineM" | "PolygonM" | "MultiPointM" | "MultiPatch",
    userOptions?: Partial<Options>
) => {
  shp: Dataview,
  shx: Dataview,
  dbf: Dataview,
}
```

The exposed options and their defaults:

| Key                                                     | Default Value   | Description                                                                                                                                                                                                                         |
| ------------------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bundlePolygonsWithLineStrings                           | boolean / true  | If true, Polygons will be interpreted as LineStrings and exported with PolyLine like Shapefile type                                                                                                                                 |
| bundleMultiTypesWithBasic                               | boolean / true  | If true, MultiPolyline and MultiPolygons will be parsed as their basic counterpart                                                                                                                                                  |
| parseElevationFromThirdElementInFeaturesCoordinateArray | boolean / false | GeoJSON supports coordinates of type [x:number, y:number, z:number], If true, the third element of coordinates array will be used as point elevation in written shapefile                                                           |
| featureElevationPropertyKey                             | string / null   | If previous option set to false, you can also specify a key from feature.properties: `{[key]: value}` to be considered the elevation of given feature                                                                               |
| FeatureMPropertyKey                                     | string / null   | Shapefiles support an additional numeric value called `M`, as denoted by shapefile types ending with `M`, if a key from feature.properties: `{[key]: value}` is given, this will be used as the `M` value in the written shapefile. |

### toGeojson

This function is still under development and will be implemented in the future.
