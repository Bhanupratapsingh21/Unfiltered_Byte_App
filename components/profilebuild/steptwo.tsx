import React, { useState } from "react";
import {
    View,
    Pressable,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import AboutYou from "@/types/aboutyoutypes";
import { StyleSheet } from "react-native";

interface SteptwoProps {
    step: number;
    totalsteps: number;
    aboutyou: Record<string, string>;
    setAboutYou: (data: Record<string, string>) => void;
    setstep: (step: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    error: string | null;
}

export default function Steptwo({
    step,
    totalsteps,
    error,
    isSubmitting,
    onSubmit,
    aboutyou,
    setAboutYou,
    setstep
}: SteptwoProps) {
    const [localError, setLocalError] = useState<string | null>(null);

    const validateAndSubmit = () => {
        const unanswered = Object.entries(aboutyou).find(([_, answer]) => !answer.trim());

        if (unanswered) {
            setLocalError(`Please answer: "${unanswered[0]}"`);
            return;
        }

        setLocalError(null); // Clear error if all answered
        onSubmit();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.headerContainer}>
                        <Pressable
                            onPress={() => setstep(1)}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </Pressable>
                        <View style={styles.stepIndicator}>
                            <Text style={{color:"white"}}>{step}/{totalsteps}</Text>
                        </View>
                    </View>

                    {/* Title */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>About You</Text>
                        <Text style={styles.subtitle}>
                            Personalising The App For Your Emotions
                        </Text>
                    </View>

                    {/* Dynamic Form Fields */}
                    <View style={styles.formContainer}>
                        {Object.keys(aboutyou).map((question, index) => (
                            <View key={index} style={styles.inputWrapper}>
                                <Text style={styles.questionText}>{question}</Text>
                                <TextInput
                                    placeholder="Your Answer"
                                    value={aboutyou[question]}
                                    onChangeText={(text) => setAboutYou({ ...aboutyou, [question]: text })}
                                    style={styles.inputField}
                                />
                            </View>
                        ))}
                    </View>

                    {/* Error Display */}
                    <View style={styles.submitContainer}>
                        {(localError || error) && <Text style={styles.errorText}>{localError || error}</Text>}
                        <TouchableOpacity
                            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                            onPress={validateAndSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Submit Profile</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F', // Dark cyberpunk background
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#292929',
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#FFB700',
        borderWidth: 1,
    },
    stepIndicator: {
        borderWidth: 1,
        borderColor: '#FFB700',
        padding: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        backgroundColor: '#1F1F1F',
    },
    titleContainer: {
        marginTop: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 16,
        color: '#B0B0B0',
        fontWeight: '400',
        marginVertical: 8,
    },
    formContainer: {
        marginTop: 20,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    questionText: {
        fontWeight: '600',
        marginBottom: 10,
        fontSize: 14,
        color: '#FFFFFF',
    },
    inputField: {
        height: 50,
        backgroundColor: '#292929',
        borderColor: '#292929',
        borderWidth: 1,
        borderRadius: 30,
        padding: 10,
        fontSize: 14,
        color: '#FFFFFF',
    },
    buttonContainer: {
        marginBottom: 10,
    },
    continueButton: {
        width: '100%',
        height: 55,
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
    continueButtonPressed: {
        opacity: 0.8,
    },
    continueButtonText: {
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: '600',
    },
    submitContainer: {
        marginTop: 30,
        marginBottom: 40,
    },
    submitButton: {
        width: '100%',
        height: 55,
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
    submitButtonDisabled: {
        backgroundColor: '#555555',
    },
    submitButtonText: {
        color: '#0F0F0F',
        fontWeight: '600',
        fontSize: 16,
    },
    errorText: {
        color: '#FF3B30',
        marginBottom: 15,
        textAlign: 'center',
    },
});
