import type { ClassifiedFeatures } from './util/immigration';
import fs from 'node:fs';
import path from 'node:path';
import { Feature } from 'geojson';

const outputDir = path.join(__dirname, "output")

const writeJsonFile = (features: ClassifiedFeatures | Record<string, Feature[]>, filename: string = "featureList") => {
    // Three files: 0D, 1D, 2D
    for (const [dimension, featureList] of Object.entries(features) as [string, Feature[]][]) {
        // When use path.join, the filename must be the last argument. (only one)
        // Therefore, use template literal string.
        const finalPath = path.join(outputDir, "json", `${filename}_${dimension}.json`);
        fs.writeFileSync(finalPath, JSON.stringify(featureList, null, 2), 'utf-8');
    }
}

export default writeJsonFile;