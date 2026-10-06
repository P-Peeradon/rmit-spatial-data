import geojson from './reader';
import classifyByGeometry, { classifyTransportPath } from './util/immigration';
import writeJsonFile from './writer';

const classifiedFeatures = classifyByGeometry(geojson);

Object.entries(classifiedFeatures).forEach(([geometryType, features]) => {
  console.log(`Features with geometry type ${geometryType}:`, features.length);
});

const roadWay = classifyTransportPath(classifiedFeatures);

writeJsonFile(classifiedFeatures, "geometry");

process.exit(0)