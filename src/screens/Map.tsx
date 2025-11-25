import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Alert, Platform, StyleSheet, View } from "react-native";
import MapView, { MapPressEvent, Marker, Camera } from "react-native-maps";
import { MainStackParamList, MapAttrs } from "../types/NavigationTypes";
import { Location } from "../types/Location";
import { useNavigation } from "@react-navigation/native";
import HeaderButton from "../components/HeaderButton";
import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import OutlinedButton from "../components/OutlinedButton";

type Props = NativeStackScreenProps<MainStackParamList, "Map">;

const Map = ({ route }: Props): ReactNode => {
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null
    );
    const [marker, setMarker] = useState<React.JSX.Element | null>(null);
    const mapView = useRef<MapView>(null);
    const navigation = useNavigation();

    const camera: Camera = {
        center: {
            latitude: route.params.lat,
            longitude: route.params.lon,
        },
        heading: 0,
        pitch: 0,
        altitude: 1000,
        zoom: 10,
    };

    useEffect(() => {
        if (route.params.lat && route.params.lon && route.params.readonly) {
            setSelectedLocation({
                lat: route.params.lat,
                lon: route.params.lon,
            });
        }
    }, [route.params, setSelectedLocation]);

    useEffect(() => {
        console.log("selectedLocation: ", selectedLocation);
        setMarker(
            selectedLocation ? (
                <Marker
                    title="Picked Location"
                    coordinate={{
                        latitude: selectedLocation.lat,
                        longitude: selectedLocation.lon,
                    }}
                />
            ) : null
        );
    }, [selectedLocation, setMarker]);

    const selectLocationHandler = (event: MapPressEvent) => {
        if (!route.params.readonly) {
            const lat = event.nativeEvent.coordinate.latitude;
            const lon = event.nativeEvent.coordinate.longitude;
            setSelectedLocation({ lat, lon });
        }
    };

    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert(
                "No location picked!",
                "You have to pick a location first"
            );
        } else {
            const attrs: MapAttrs = {
                lat: selectedLocation.lat,
                lon: selectedLocation.lon,
                readonly: route.params.readonly,
            };
            navigation.navigate("AddPlace", attrs);
        }
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        if (!route.params.readonly) {
            navigation.setOptions({
                headerRight: ({ tintColor }: HeaderButtonProps) => (
                    <HeaderButton
                        color={tintColor ? tintColor : "#fff"}
                        name="save"
                        size={24}
                        onPress={savePickedLocationHandler}
                    />
                ),
            });
        }
    }, [navigation, savePickedLocationHandler, route.params.readonly]);

    const zoomInHandler = () => {
        if (mapView) {
            mapView.current?.getCamera().then((camera) => {
                if (Platform.OS === "android") {
                    camera.zoom! += 1;
                } else {
                    camera.altitude! /= 2;
                }
                mapView.current?.animateCamera(camera);
            });
        }
    };
    const zoomOutHandler = () => {
        if (mapView) {
            mapView.current?.getCamera().then((camera) => {
                if (Platform.OS === "android") {
                    camera.zoom! -= 1;
                } else {
                    camera.altitude! *= 2;
                }
                mapView.current?.animateCamera(camera);
            });
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapView}
                style={styles.map}
                onPress={selectLocationHandler}
                camera={camera}
            >
                {marker}
            </MapView>
            <View style={styles.buttonContainer}>
                <OutlinedButton icon="remove-circle" onPress={zoomOutHandler}>
                    Zoom Out
                </OutlinedButton>
                <OutlinedButton icon="add-circle" onPress={zoomInHandler}>
                    Zoom In
                </OutlinedButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    buttonContainer: {
        padding: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

export default Map;
