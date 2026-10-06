import { FeatureCollection, type Feature } from 'geojson';

// Define the structure for our classified buckets
export interface ClassifiedFeatures {
    '0D': Feature[]; // Points, MultiPoints
    '1D': Feature[]; // LineStrings, MultiLineStrings
    '2D': Feature[]; // Polygons, MultiPolygons
}

export function classifyByGeometry(features: FeatureCollection): ClassifiedFeatures {
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

export function classifyTransportPath(features: FeatureCollection | ClassifiedFeatures | Feature[]): Record<string, Feature[]> {
    const bucket: Record<string, Feature[]> = {};
    let featureList: Feature[] = [];

    // We have two cases: either the input is a FeatureCollection or an array of Features. We need to handle both.
    // If it's a FeatureCollection, we extract the features array; if it's already an array, we use it directly.
    if (!features || (Array.isArray(features) && features.length === 0)) {
        console.warn('No features provided for transport classification.');
        return bucket;
    } else if (features instanceof Object && 'type' in features && features.type === 'FeatureCollection') {
        featureList = features.features;
    } else if (features instanceof Object) {

    } else {
        featureList = Array.isArray(features) ? features : [];
    }

    // filter for only LineString and MultiLineString features
    // Actually, we need some attribute to classify them as transport paths. For now, we will just filter by geometry type.
    const filteredFeatures = featureList.filter(feature => 
        feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString'
    );

    // For data exported from OpenStreetMap, we can classify transport paths based on the 'highway' property in the feature's properties.
    // For road, Highway is not null and for railway, Railway is not null.
    filteredFeatures.forEach(feature => {
        const highwayType = feature.properties?.highway ?? 'unknown';
        bucket[highwayType].push(feature)
    });

    return bucket;
}

export default classifyByGeometry;