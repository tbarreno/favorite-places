import * as SQLite from "expo-sqlite";
import { Place } from "../models/Place";

// Database name
const DATABASE_NAME = "places.db";

let placeDb: SQLite.SQLiteDatabase;

type DBPlace = {
    id: number,
    uuid: string,
    title: string,
    imageUri: string,
    address: string,
    lat: number,
    lon: number,
}

// Database init (sync)
export const initSync = () => {
    const database = SQLite.openDatabaseSync(DATABASE_NAME);

    database.execSync(`
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            imageUri TEXT NOT NULL,
            address TEXT NOT NULL,
            lat REAL NOT NULL,
            lon REAL NOT NULL
        )`);
};

// Database init (sync)
export const init = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        SQLite.openDatabaseAsync(DATABASE_NAME)
            .then((database) => {
                database
                    .execAsync(
                        `
            CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                uuid TEXT NOT NULL,
                title TEXT NOT NULL,
                imageUri TEXT NOT NULL,
                address TEXT NOT NULL,
                lat REAL NOT NULL,
                lon REAL NOT NULL
                )`
                    )
                    .then(() => {
                        placeDb = database;
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const insertPlace = (place: Place): Promise<Place> => {
    return new Promise((resolve, reject) => {
        placeDb
            .runAsync(
                `
            INSERT INTO places
            (uuid, title, imageUri, address, lat, lon)
            VALUES
            (?, ?, ?, ?, ?, ?)
            `,
                [
                    place.id,
                    place.title,
                    place.imageUri || "",
                    place.address || "",
                    place.latitude || 0,
                    place.longitude || 0,
                ]
            )
            .then(() => {
                resolve(place);
            })
            .catch((error) => {
                reject(`Error storing data: ${error}`);
            });
    });
};

export const fetchPlaces = (): Promise<Place[]> => {
    return new Promise((resolve, reject) => {
        placeDb
            .getAllAsync<DBPlace>("SELECT * from places")
            .then((results) => {
                console.log(results);
                resolve(results.map(entry => (dbToPlace(entry))));
            })
            .catch((error) => {
                reject(`Error storing data: ${error}`);
            });
    });
};

export const fetchPlaceDetails = (placeId: string): Promise<Place> => {
    return new Promise((resolve, reject) => {
        placeDb
            .getFirstAsync<DBPlace>("SELECT * from places WHERE uuid=?", [placeId])
            .then((place) => {
                if (place === null) {
                    reject(`Favorite place with ID '${placeId}' not found`);
                } else {
                    resolve(dbToPlace(place));
                }
            })
            .catch((error) => {
                reject(`Error retrieving favorite place with ID '${placeId}': ${error}`);
            });
    });
};

export const deletePlace = (placeId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        placeDb
            .runAsync(`DELETE FROM places WHERE uuid = ?`, [placeId])
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(`Error deleting place with ID '${placeId}': ${error}`);
            });
    });
};

// Converts DB entry to app DTO
const dbToPlace = (entry: DBPlace): Place => {
    return {
        id: entry.uuid,
        title: entry.title,
        address: entry.address,
        imageUri: entry.imageUri,
        latitude: entry.lat,
        longitude: entry.lon,
    }
}