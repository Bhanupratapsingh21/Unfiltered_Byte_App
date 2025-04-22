import React from "react";
import {
    View,
    Pressable,
    Text,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StyleSheet,
    TextInput
} from "react-native";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface EmailScreenProps {
    email: string;
    setEmail: (email: string) => void;
    onNext: () => void;
}

export default function EmailScreen({ email, setEmail, onNext }: EmailScreenProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
                contentContainerStyle={styles.scrollViewContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.mainContainer}>
                    {/* Background Image */}
                    <Image
                        source={require("@/assets/images/Authstep1.png")}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />

                    {/* Content Wrapper */}
                    <View style={styles.contentWrapper}>
                        <View style={styles.contentCard}>
                            {/* Logo */}
                            <Image
                                source={require("@/assets/images/logowithoutname.png")}
                                style={styles.logo}
                                resizeMode="contain"
                            />

                            {/* Heading */}
                            <Text style={styles.heading}>Get Started</Text>
                            <Text style={styles.subheading}>
                                Start your journey towards success with our expert-led programs
                            </Text>

                            {/* Email Input */}
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    placeholder="example@email.com"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    value={email}
                                    onChangeText={setEmail}
                                    style={styles.input}
                                />
                            </View>

                            {/* Continue Button */}
                            <Pressable
                                onPress={onNext}
                                style={styles.signUpButton}
                                disabled={!email}
                            >
                                <Text style={styles.signUpButtonText}>Continue</Text>
                            </Pressable>

                            {/*
                            <View style={styles.socialButtonsContainer}>
                                <View style={styles.socialButton}>
                                    <AntDesign name="google" size={16} color="white" />
                                </View>
                                <View style={styles.socialButton}>
                                    <AntDesign name="apple1" size={16} color="white" />
                                </View>
                                <View style={styles.socialButton}>
                                    <FontAwesome name="facebook-official" size={16} color="white" />
                                </View>
                            </View>
                           */}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    )
}
const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    mainContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#0F0F0F', // Dark mode
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
    },
    contentCard: {
        borderRadius: 30,
        backgroundColor: '#1F1F1F', // Dark card
        borderWidth: 1,
        borderColor: '#292929', // Subtle border
        shadowColor: '#FFB700', // Neon effect
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        paddingHorizontal: 25,
        paddingVertical: 25,
    },
    logo: {
        width: 56,
        height: 56,
        marginBottom: 16,
        borderRadius: 8,
    },
    heading: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF', // White text
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
    signUpButton: {
        width: '100%',
        height: 55,
        marginVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFB700', // Neon yellow
        borderRadius: 8,
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 8,
    },
    signUpButtonPressed: {
        opacity: 0.8,
    },
    signUpButtonText: {
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: '600',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    socialButton: {
        backgroundColor: '#292929',
        paddingHorizontal: 30,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FFB700',
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 6,
    },
});
