import { ReactNode, useContext, useEffect, useState } from "react";
import { PlaceContext } from "../store/place-store";
import PlacesList from "../components/places/PlacesList";
import { useIsFocused } from "@react-navigation/native";
import { Place } from "../models/Place";
import { fetchPlaces } from "../util/database";

const AllPlaces = (): ReactNode => {
    const isFocused = useIsFocused();
    const { places, setAllPlaces } = useContext(PlaceContext);
    const [localPlaces, setLocalPlaces] = useState<Place[]>([]);

    useEffect(() => {
        fetchPlaces().then(places => {
            setAllPlaces(places);
            setLocalPlaces(places);
        });
    }, [fetchPlaces]);

    // Needed to refresh the screen
    useEffect(() => {
        setLocalPlaces(places);
    }, [isFocused]);

    return <PlacesList places={localPlaces} />;
};

export default AllPlaces;
