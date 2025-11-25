import { createContext, PropsWithChildren, ReactNode, useReducer } from "react";
import { Place } from "../models/Place";
import { generateQuickGuid } from "../util/quick-guid";
import { insertPlace } from "../util/database";

export const localPlaces: Place[] = [];

type PlaceContextType = {
    places: Place[];
    addPlace: (place: Place) => void;
    setAllPlaces: (places: Place[]) => void;
};

export const PlaceContext = createContext<PlaceContextType>({
    places: [],
    addPlace: (_place: Place) => {},
    setAllPlaces: (_places: Place[]) => {},
});

enum PlaceActionNames {
    Add = "add",
    StoreAllPlaces = "all",
}

type PlaceAction = {
    type: PlaceActionNames;
    payload: Place | Place[];
};

const placeReducer = (state: Place[], action: PlaceAction) => {
    switch (action.type) {
        case PlaceActionNames.Add:
            if (Array.isArray(action.payload)) {
                return action.payload;
            }

            if (action.payload.id === "") {
                action.payload.id = generateQuickGuid();
                state.push(action.payload);
                insertPlace(action.payload);
                return state;
            }

            const payloadId = action.payload.id;
            const placeIdx = state.findIndex((place) => place.id === payloadId);
            if (placeIdx < 0) {
                state.push(action.payload);
                return state;
            }
            const newPlaces = state.filter((place) => place.id !== payloadId);
            newPlaces.push(action.payload);
            return newPlaces;

        default:
            return state;
    }
};

export const PlaceContextProvider = ({ children }: PropsWithChildren) => {
    const [placeState, dispatch] = useReducer(placeReducer, []);

    const addPlace = (place: Place) => {
        dispatch({
            type: PlaceActionNames.Add,
            payload: place,
        });
    };

    const setAllPlaces = (places: Place[]) => {
        dispatch({
            type: PlaceActionNames.Add,
            payload: places,
        });
    };

    const placeContextValue: PlaceContextType = {
        places: placeState,
        addPlace,
        setAllPlaces,
    };

    return (
        <PlaceContext.Provider value={placeContextValue}>
            {children}
        </PlaceContext.Provider>
    );
};
