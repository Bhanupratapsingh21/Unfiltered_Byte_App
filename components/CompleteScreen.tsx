import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { RelativePathString, useRouter } from "expo-router";


interface ThankYouScreenProps {
    onComplete?: () => void;
    redirectTo?: string;
}

export default function ThankYouScreen({
    onComplete,
    redirectTo = "/auth/profile"
}: ThankYouScreenProps) {
    const router = useRouter();
    const [time, setTime] = useState(5);

    useEffect(() => {
        // Countdown timer
        const interval = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval);
                }
                return prevTime - 1;
            });
        }, 1000);

        // Redirect after timeout
        const timeout = setTimeout(() => {
            if (onComplete) {
                onComplete();
            } else {
                router.replace(redirectTo as RelativePathString);
            }
        }, 5000);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [redirectTo, router, onComplete]);

    return (
        <View style={styles.container}>
            {/* Confetti Background Animation */}
            <LottieView
                source={require("../assets/lottie/confetti3.json")}
                autoPlay
                loop={false}
                style={styles.confettiAnimation}
            />

            {/* Completed Checkmark Animation */}
            <LottieView
                source={require("../assets/lottie/completed.json")}
                autoPlay
                loop={false}
                style={styles.checkmarkAnimation}
            />

            <Text style={styles.redirectText}>
                Redirecting in {time} seconds...
            </Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F0F0F", // Dark cyberpunk background
    },
    confettiAnimation: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    checkmarkAnimation: {
        width: 220,
        height: 220,
    },
    successText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#FFB700", // Neon yellow
        marginBottom: 20,
        textAlign: "center",
        textShadowColor: "#FFB700",
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    redirectText: {
        fontSize: 16,
        color: "#B0B0B0",
        textAlign: "center",
        marginTop: 20,
    },
});
