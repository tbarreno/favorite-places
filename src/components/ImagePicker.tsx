import { ReactNode, useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
    launchCameraAsync,
    useCameraPermissions,
    PermissionStatus,
} from "expo-image-picker";
import { ImageInfo } from "../types/ImageInfo";
import { Colors } from "../constants/colors";
import OutlinedButton from "./OutlinedButton";

type ImageData = ImageInfo | null;

type Props = {
    image: ImageData;
    onImageSelected: (imageInfo: ImageInfo) => void;
};

const ImagePicker = ({ image, onImageSelected }: Props): ReactNode => {
    // iOS request
    const [cameraPermissionInformation, requestPermission] =
        useCameraPermissions();

    const verifyPermissions = (): Promise<boolean> => {
        return new Promise<boolean>((resolve) => {
            if (
                cameraPermissionInformation?.status ===
                PermissionStatus.UNDETERMINED
            ) {
                requestPermission().then((permissionResponse) => {
                    resolve(permissionResponse.granted);
                });
            }

            if (
                cameraPermissionInformation?.status === PermissionStatus.DENIED
            ) {
                Alert.alert(
                    "Camera access denied",
                    "This app requires access to the camera to get the location images"
                );
                resolve(false);
            }

            resolve(true);
        });
    };

    const takeImageHandler = () => {
        verifyPermissions().then((isGranted) => {
            if (isGranted) {
                launchCameraAsync({
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.5,
                }).then((image) => {
                    console.log(image);
                    if (!image.canceled && image.assets.length > 0) {
                        onImageSelected({
                            uri: image.assets[0].uri,
                            height: image.assets[0].height,
                            width: image.assets[0].width,
                        });
                    }
                });
            }
        });
    };

    const preview =
        image === null ? (
            <Text style={styles.defaultText}>No image yet</Text>
        ) : (
            <Image
                source={{
                    uri: image.uri,
                    height: image.height,
                    width: image.width,
                }}
                style={styles.previewImage}
            />
        );

    return (
        <View>
            <View style={styles.previewContainer}>{preview}</View>
            <OutlinedButton icon="camera" onPress={takeImageHandler}>
                Snap
            </OutlinedButton>
        </View>
    );
};

const styles = StyleSheet.create({
    defaultText: {
        height: 180,
        textAlignVertical: "center",
        textAlign: "center",
        color: "#fff",
        backgroundColor: Colors.primary800,
        marginBottom: 6,
    },
    previewContainer: {
        height: 180,
        marginBottom: 6,
        borderRadius: 4,
    },
    previewImage: {
        height: "100%",
        width: "100%",
        borderRadius: 4,
    },
});

export default ImagePicker;
