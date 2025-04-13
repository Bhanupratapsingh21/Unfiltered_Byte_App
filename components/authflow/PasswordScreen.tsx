import React from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    StyleSheet,
    Image
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface PasswordScreenProps {
    password: string;
    setPassword: (password: string) => void;
    onSubmit: () => void;
    onBack: () => void;
    loading: boolean;
    retryDelay?: number;
}

export default function PasswordScreen({
    password,
    setPassword,
    onSubmit,
    onBack,
    loading,
    retryDelay = 0
}: PasswordScreenProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.mainContainer}>
                    {/* Background Image */}
                    <Image
                        source={require("@/assets/images/getstartedpagebg.png")}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />

                    {/* Content Wrapper */}
                    <View style={styles.contentWrapper}>
                        <View style={styles.contentCard}>
                            {/* Back Button */}
                            <Pressable onPress={onBack} style={styles.backButton}>
                                <AntDesign name="arrowleft" size={24} color="black" />
                            </Pressable>

                            {/* Heading */}
                            <View style={styles.textContainer}>
                                <Text style={styles.heading}>Enter Your Password</Text>
                                <Text style={styles.subheading}>
                                    Secure your account with a strong password
                                </Text>
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="••••••••"
                                    placeholderTextColor="#999"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    style={styles.input}
                                    editable={retryDelay <= 0}
                                />
                            </View>

                            {retryDelay > 0 && (
                                <Text style={styles.retryText}>
                                    Try again in {retryDelay} seconds
                                </Text>
                            )}

                            {/* Continue Button */}
                            <Pressable
                                onPress={onSubmit}
                                style={[styles.signUpButton, (loading || retryDelay > 0) && styles.buttonDisabled]}
                                disabled={loading || retryDelay > 0}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.signUpButtonText}>
                                        {retryDelay > 0 ? "Please Wait" : "Sign In"}
                                    </Text>
                                )}
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0F0F0F', // Dark background
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    backgroundImage: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    contentWrapper: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        width: '100%',
        marginTop: -50,
    },
    contentCard: {
        borderRadius: 30,
        backgroundColor: '#1F1F1F', // Dark card
        borderWidth: 1,
        borderColor: '#292929',
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        paddingHorizontal: 25,
        paddingVertical: 25,
    },
    backButton: {
        backgroundColor: '#292929',
        padding: 8,
        width: 40,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderColor: '#FFB700',
        borderWidth: 1,
    },
    textContainer: {
        marginBottom: 24,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF', // White heading
    },
    subheading: {
        fontSize: 16,
        color: '#B0B0B0', // Muted white
        fontWeight: '400',
        marginVertical: 8,
    },
    inputWrapper: {
        width: '100%',
        marginTop: 16,
        marginBottom: 8,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#292929',
        borderRadius: 10,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#FFFFFF',
        borderColor: '#292929',
        borderWidth: 1,
    },
    retryText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: 8,
        fontSize: 14,
    },
    signUpButton: {
        width: '100%',
        height: 55,
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFB700',
        borderRadius: 8,
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: '#666',
    },
    signUpButtonText: {
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: '600',
    },
});
