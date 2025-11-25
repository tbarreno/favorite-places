import { ReactNode, useContext } from "react";
import PlaceForm from "../components/places/PlaceForm";
import { Place } from "../models/Place";
import { useNavigation } from "@react-navigation/native";
import { PlaceContext } from "../store/place-store";

const AddPlace = (): ReactNode => {
    const navigation = useNavigation();
    const { addPlace } = useContext(PlaceContext);

    const newPlaceHandler = (place: Place) => {
        console.log("Saving new place:");
        console.log(place);

        addPlace(place);

        navigation.navigate("List");
    };

    return <PlaceForm onAddPlace={newPlaceHandler} />;
};

export default AddPlace;
