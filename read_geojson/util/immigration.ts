import { FeatureCollection, type Feature } from 'geojson';

// Define the structure for our classified buckets
export interface ClassifiedFeatures {
    '0D': Feature[]; // Points, MultiPoints
    '1D': Feature[]; // LineStrings, MultiLineStrings
    '2D': Feature[]; // Polygons, MultiPolygons
}

function isClassifiedFeatures(obj: unknown): obj is ClassifiedFeatures {
    return (
        obj !== null &&
        typeof obj === "object" &&
        '0D' in obj &&
        '1D' in obj &&
        '2D' in obj &&
        Array.isArray((obj as ClassifiedFeatures)['0D']) &&
        Array.isArray((obj as ClassifiedFeatures)['1D']) &&
        Array.isArray((obj as ClassifiedFeatures)['2D'])
    );
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
    let filteredFeature: Feature[] = [];

    // We have two cases: either the input is a FeatureCollection or an array of Features. We need to handle both.
    // If it's a FeatureCollection, we extract the features array; if it's already an array, we use it directly.
    if (!features || (Array.isArray(features) && features.length === 0)) {
        console.warn('No features provided for transport classification.');
        return bucket;
    } else if (features instanceof Object && 'type' in features && features.type === 'FeatureCollection') {
        featureList = features.features.filter(feature => 
            feature.geometry.type === 'LineString' || feature.geometry.type === 'MultiLineString'
        );
    } else if (features instanceof Object && isClassifiedFeatures(features)) {
        featureList = features["1D"];
    } else {
        featureList = Array.isArray(features) ? features : [];
    }

    filteredFeature = featureList.filter((feature: Feature) => !(feature.properties?.highway && feature.properties?.railway) && 
                            (feature.properties?.highway || feature.properties?.railway));

    console.log(filteredFeature);

    filteredFeature.forEach((feature: Feature) => {
        switch (feature.properties?.highway.toLowerCase()) {
            case 'motorway':
                if (!bucket['freeway'])
                    bucket['freeway'] = [];

                bucket['freeway'].push(feature);
                break;

            case 'primary':
            case 'secondary':
            case 'tertiary':
                if (!bucket['urban'])
                    bucket['urban'] = [];

                bucket['urban'].push(feature)
                break;

            case 'residential':
            case 'service':
                if (!bucket['municipal'])
                    bucket['municipal'] = [];

                bucket['municipal'].push(feature);
                break;

            case 'footway':
            case 'pedestrian':
                if (!bucket['footpath'])
                    bucket['footpath'] = [];

                bucket['footpath'].push(feature);
                break;

            case 'cycleway':
                if (!bucket['cycling'])
                    bucket['cycling'] = [];

                bucket['cycling'].push(feature);
                break;

            case 'construction':
            case 'proposed':
                if (!bucket['future'])
                    bucket['future'] = [];

                bucket['future'].push(feature);
                break;

            case 'unclassified':
            default:
                if (!bucket['unknown'])
                    bucket['unknown'] = [];
                
                if (!feature.properties?.railway)
                    bucket['unknown'].push(feature);
                break;      
        }

        switch (feature.properties?.railway.toLowerCase()) {
            case 'train':
            case 'subway':
                bucket['metro'].push(feature);
                break;
            
            case 'tram':
                bucket['tram'].push(feature);
                break;

            default:
                break;
        }
    });

    return bucket;
}

export default classifyByGeometry;