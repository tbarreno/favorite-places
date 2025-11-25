const STATIC_MAP_URL = "http://192.168.12.25:3000/";
const REVERSE_GEOCODING_URL = "https://nominatim.openstreetmap.org/reverse";

type params = {
    lat: number;
    lon: number;
};

export const getMapPreview = ({ lat, lon }: params): string => {
    const options: string[] = [];

    options.push("height=200");
    options.push("width=400");
    options.push(`center=${lon},${lat}`);
    options.push("zoom=13");
    options.push(`geojson=[{"type":"Point","coordinates":[${lon},${lat}]}]`);

    console.log(`Getting OSM image for lat:${lat}, lon: ${lon}`);

    return `${STATIC_MAP_URL}?${options.join("&")}`;
};

export const getReverseGeocode = async ({ lat, lon }: params): Promise<string> => {
    const options: string[] = ["format=jsonv2", `lat=${lat}`, `lon=${lon}`];

    const url = `${REVERSE_GEOCODING_URL}?${options.join("&")}`;

    const response = await fetch(url, {
        headers: {
            "User-Agent":
                "React-Native learning (geolocation test app)",
        },
    });

    if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return data.display_name;
};
