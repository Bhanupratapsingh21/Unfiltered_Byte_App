import {
    View,
    Image,
    Text,
    Pressable,
    ScrollView,
    StyleSheet
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

export default function AuthIndexScreen() {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, []);

    if (isAuthenticated) return null;


    return (
        <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.mainContainer}>
                <View style={styles.topSection}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require("@/assets/images/logomainwithouttegline.png")}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.progressIndicatorContainer}>

                    </View>
                </View>

                <View style={styles.bottomSection}>
                    <Text style={styles.title}>Swipe. Discover. Repeat.</Text>
                    <Text style={styles.subtitle}>Curated journeys, at your command.</Text>

                    {/*
                    <Link href="/auth/login" asChild>
                        <Pressable style={styles.signUpButton}>
                            <Text style={styles.signUpButtonText}>Sign Via OTP</Text>
                        </Pressable>
                    </Link>
                   */}

                    <Link href="/auth/signup" asChild>
                        <Pressable style={styles.signUpButton}>
                            <Text style={styles.signUpButtonText}>Let's Go</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#0F0F0F',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    topSection: {
        backgroundColor: '#0F0F0F',
        width: '100%',
        height: '70%',
    },
    imageContainer: {
        flex: 1,
        paddingHorizontal: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '80%',
    },
    image: {
        width: '80%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    progressIndicatorContainer: {
        height: 'auto',
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
    },
    progressIndicator: {
        width: '25%',
        height: 4,
        borderRadius: 2,
    },
    activeProgress: {
        backgroundColor: '#FFB700',
    },
    inactiveProgress: {
        backgroundColor: 'rgba(255, 183, 0, 0.4)',
    },
    bottomSection: {
        backgroundColor: '#1F1F1F',
        borderWidth: 1,
        borderColor: '#292929',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 32,
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 14,
        color: '#B0B0B0',
        fontWeight: '400',
        textAlign: 'center',
        marginVertical: 14,
    },
    signUpButton: {
        width: '100%',
        height: 48,
        marginVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffb700',
        borderRadius: 8,
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    signUpButton2: {
        width: '100%',
        height: 48,
        marginVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#292929',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    signUpButtonPressed: {
        opacity: 0.8,
    },
    signUpButtonText: {
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: '600',
    },
});
