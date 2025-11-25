import { ReactNode } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";

type Props = {
    icon: keyof typeof Ionicons.glyphMap;
    children: ReactNode;
    onPress: () => void;
};

const ActionButton = ({ children, icon, onPress }: Props): ReactNode => {
    return (
        <Pressable
            style={(pressed) => [styles.button, pressed && styles.pressed]}
            onPress={onPress}
        >
            <Ionicons
                style={styles.icon}
                name={icon}
                size={18}
                color={Colors.primary500}
            />
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary800,
        elevation: 2,
        shadowColor: "black",
        shadowOpacity: 0.15,
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 2,
        borderRadius: 4,
    },
    pressed: {
        opacity: 0.7,
    },
    icon: {
        marginRight: 6,
    },
    text: {
        fontSize: 16,
        color: Colors.primary50,
    },
});

export default ActionButton;
