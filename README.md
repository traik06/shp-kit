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
| ⚠ PolyLineM    | ❌   | ✅    |
| ⚠ PolygonM     | ❌   | ❌    |
| ⚠ MultiPointM  | ❌   | ❌    |
| MultiPatch     | ❌   | ❌    |

Please note:

1. Types ending with M are outdated, not sufficiently tested, and not recommended for use.
2. The API specified below may change without notice before reaching v1.0.0

## Library Functions

### shpWrite

```typescript
shpWrite: (
    geojson: FeatureCollection, // GeoJSON feature collection
    type: "Null Shape" | "Point" | "PolyLine" | "Polygon" | "MultiPoint" | "PointZ" | "PolyLineZ" | "PolygonZ" | "MultiPointZ" | "PointM" | "PolyLineM" | "PolygonM" | "MultiPointM" | "MultiPatch",
    userOptions?: Partial<Options> // See available options below
) => Promise<{ // Object containing the most important files in a shapefile, objects are given as Dataviews. Use shp.buffer to do whatever you need from here
  shp: Dataview,
  shx: Dataview,
  dbf: Dataview,
}>
```

The exposed options and their defaults:

| Key                                                     | Expected type / Default Value | Description                                                                                                                                                                                                                         |
| ------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bundlePolygonsWithLineStrings                           | boolean / true                | If true, Polygons will be interpreted as LineStrings and exported with PolyLine like Shapefile type                                                                                                                                 |
| bundleMultiTypesWithBasic                               | boolean / true                | If true, MultiPolyline and MultiPolygons will be parsed as their basic counterpart                                                                                                                                                  |
| parseElevationFromThirdElementInFeaturesCoordinateArray | boolean / true                | GeoJSON supports coordinates of type [x:number, y:number, z:number], If true, the third element of coordinates array will be used as point elevation in written shapefile                                                           |
| featureElevationPropertyKey                             | string / null                 | If previous option set to false, you can also specify a key from feature.properties: `{[key]: value}` to be considered the elevation of given feature                                                                               |
| FeatureMPropertyKey                                     | string / null                 | Shapefiles support an additional numeric value called `M`, as denoted by shapefile types ending with `M`, if a key from feature.properties: `{[key]: value}` is given, this will be used as the `M` value in the written shapefile. |

### shpRead

```typescript
shpRead: (
  shp: File, // File or Blob
  options: Partial<Options>, // WIP
  dbf?: File, // optional dbase file that would populate feature properties
  prj?: File | string // optional projection file, or projection string. If present, shpRead will re-project your shapefile into WGS84, alternatively feel free to use reprojectGeojson function also available in this library
) => Promise<FeatureCollection> // GeoJSON feature collection
```

This function is still under development and will be implemented in the future.

### reprojectGeoJson

```typescript
reprojectGeoJson: (
  geojson: FeatureCollection, // GeoJSON feature collection
  sourceProjection: string, // Can be either PROJ.4 string or WKT string, such as you find in the *.prj file with your shapefile (if provided)
  targetProjection: string, // Can be either PROJ.4 string or WKT string, such as you find in the *.prj file with your shapefile (if provided)
  originalGeometryPropertyKey?: string // Key under which you would like the original geometry to be saved. Useful when showing on a WGS84 map while showing coordinates in state-plane or local space
) => FeatureCollection // GeoJSON feature collection
```

This function is still under development and will be implemented in the future.
