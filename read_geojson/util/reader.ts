import type { Geometry, FeatureCollection } from 'geojson';
import path from 'path';
import fs from 'node:fs';

// Landarea of RMIT City Campus in Carlton, Melbourne, Australia
// This is the first layer since it defines area for people transportation
const directory = path.join(__dirname, '../raw-source/RMIT_CityCarlton_Landarea.geojson');

const rawData = fs.readFileSync(directory, 'utf-8');
const geojson = JSON.parse(rawData) as FeatureCollection<Geometry>;

export default geojson;