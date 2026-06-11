const mapComponentNames = [
  "AIRMap",
  "AIRMapCallout",
  "AIRMapCalloutSubview",
  "AIRMapCircle",
  "AIRMapHeatmap",
  "AIRMapLocalTile",
  "AIRMapMarker",
  "AIRMapOverlay",
  "AIRMapPolygon",
  "AIRMapPolyline",
  "AIRMapUrlTile",
  "AIRMapWMSTile",
];

module.exports = {
  project: {
    android: {
      unstable_reactLegacyComponentNames: mapComponentNames,
    },
    ios: {
      unstable_reactLegacyComponentNames: mapComponentNames,
    },
  },
};
