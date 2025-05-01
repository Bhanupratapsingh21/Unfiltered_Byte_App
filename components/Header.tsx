import React, { useRef } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Platform,
    TouchableOpacity,

} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";


export default function Header() {
    const router = useRouter();

    return (

        <BlurView
            intensity={130}
            tint="dark"
            style={{
                borderColor: "#fff",
                borderWidth: 0.4,
                position: "absolute",
                top: Platform.OS === "ios" ? 50 : 20,
                left: 16,
                right: 16,
                zIndex: 10,
                borderRadius: 30,
                overflow: "hidden",
                height: 50,
                paddingHorizontal: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }}
        >
            <Image source={require("@/assets/images/logomainwithouttegline.png")} style={styles.logo} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => router.push("/Profile")} style={styles.menuButton}>
                    <Ionicons name="person" size={20} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/Trainings/Pomodoro")} style={styles.menuButton}>
                    <Ionicons name="alarm" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </BlurView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F0F",
    },
    header: {
        position: "absolute",
        top: Platform.OS === "ios" ? 50 : 20,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "blur",
        paddingHorizontal: 16,
        marginHorizontal: 24,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    menuButton: {
        padding: 10,
    },
    scrollContent: {
        paddingTop: Platform.OS === "ios" ? 100 : 50,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
    tagContainer: {
        paddingHorizontal: 16,
        paddingBottom: 15,
        gap: 8,
        height: 60,
        alignItems: "center",
    },
    tag: {
        borderColor: "#fff",
        borderWidth: 0.4,
        borderRadius: 20,
        height: 30,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    tagText: {
        color: "#fff",
        fontSize: 13,
    },
    bottomButtonContainer: {
        position: "absolute",
        bottom: 80,
        left: 16,
        right: 16,
    },
    bottomButton: {
        height: 56,
        backgroundColor: "#FFB700",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});
