import type { Feature, FeatureCollection } from 'geojson';

// Define the structure for our classified buckets
interface ClassifiedFeatures {
    '0D': Feature[]; // Points, MultiPoints
    '1D': Feature[]; // LineStrings, MultiLineStrings
    '2D': Feature[]; // Polygons, MultiPolygons
}

function classifyByGeometry(features: FeatureCollection): ClassifiedFeatures {
    const bucket: ClassifiedFeatures = {
        '0D': [],
        '1D': [],
        '2D': []
    };

    features.features.forEach((feature) => {
        switch (feature.geometry.type) {
            case 'Point':
            case 'MultiPoint':
                bucket['0D'].push(feature);
                break;
            
            case 'LineString':
            case 'MultiLineString':
                bucket['1D'].push(feature);
                break;

            case 'Polygon':
            case 'MultiPolygon':
                bucket['2D'].push(feature);
                break;
            default:
                console.warn(`Unknown geometry type: ${feature.geometry.type}`);
        }
    });

    return bucket;
}

export default classifyByGeometry;