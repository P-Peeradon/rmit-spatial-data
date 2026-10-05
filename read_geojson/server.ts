import geojson from './reader';
import classifyByGeometry from './util/check';

const classifiedFeatures = classifyByGeometry(geojson);

Object.entries(classifiedFeatures).forEach(([geometryType, features]) => {
  console.log(`Features with geometry type ${geometryType}:`, features.length);
});