// Import Alert if you want to show pop-up, or continue with Text error
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
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Checkbox from "expo-checkbox";
import userdata from "@/types/userprofile.types";
import Authdata from "@/types/authdata.types";

interface OtpScreenProps {
    userdata: userdata;
    setUserData: (userdata: userdata) => void;
    step: number;
    totalsteps: number;
    setstep: (step: number) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    error: string | null;
    authData: Authdata;
    setauthData: (authData: Authdata) => void;
}

export default function Stepone({
    step,
    totalsteps,
    authData,
    setauthData,
    onSubmit,
    isSubmitting,
    error,
    userdata,
    setUserData,
    setstep
}: OtpScreenProps) {
    const [isChecked, setIsChecked] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const validateAndSubmit = () => {
        if (!userdata.firstname.trim()) {
            setLocalError("First Name is required.");
            return;
        }
        if (!userdata.lastname.trim()) {
            setLocalError("Last Name is required.");
            return;
        }
        if (!userdata.gender.trim()) {
            setLocalError("Please select your gender.");
            return;
        }
        if (!authData.phone.trim()) {
            setLocalError("Phone number is required.");
            return;
        }
        if (!userdata.city.trim()) {
            setLocalError("City is required.");
            return;
        }
        if (!userdata.country.trim()) {
            setLocalError("Country is required.");
            return;
        }
        if (!isChecked) {
            setLocalError("You must accept the Terms and Conditions.");
            return;
        }

        // If all validations pass
        setLocalError(null); // Clear any previous error
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
                    <View style={styles.headerContainer}>
                        <Pressable
                            onPress={() => setstep(2)}
                            style={styles.backButton}
                        >
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </Pressable>
                        <View style={styles.stepIndicator}>
                            <Text style={{ color: "#FFFFFF" }}>{step}/{totalsteps}</Text>
                        </View>
                    </View>

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Start Your journey towards better Mental Health
                        </Text>
                    </View>

                    {/* First & Last Name */}
                    <View style={styles.nameInputContainer}>
                        <View style={styles.nameInputWrapper}>
                            <Text style={styles.inputLabel}>First Name</Text>
                            <TextInput
                                placeholder="Your First Name"
                                value={userdata.firstname}
                                onChangeText={(text) => setUserData({ ...userdata, firstname: text })}
                                style={styles.textInput}
                            />
                        </View>

                        <View style={styles.nameInputWrapper}>
                            <Text style={styles.inputLabel}>Last Name</Text>
                            <TextInput
                                placeholder="Your Last Name"
                                value={userdata.lastname}
                                onChangeText={(text) => setUserData({ ...userdata, lastname: text })}
                                style={styles.textInput}
                            />
                        </View>
                    </View>

                    {/* Gender Selection */}
                    <View style={styles.genderContainer}>
                        <Text style={styles.inputLabel}>Gender</Text>
                        <View style={styles.genderOptionsContainer}>
                            {["male", "female", "other"].map((gender) => (
                                <Pressable
                                    key={gender}
                                    style={[
                                        styles.genderOption,
                                        userdata.gender === gender && styles.genderOptionSelected
                                    ]}
                                    onPress={() => setUserData({ ...userdata, gender })}
                                >
                                    {gender === "male" && <FontAwesome name="mars" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "female" && <FontAwesome name="venus" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    {gender === "other" && <FontAwesome name="genderless" size={20} color={userdata.gender === gender ? "white" : "black"} />}
                                    <Text style={[
                                        styles.genderOptionText,
                                        userdata.gender === gender && styles.genderOptionTextSelected
                                    ]}>
                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Phone */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Mobile Number</Text>
                        <TextInput
                            placeholder="Your Mobile Number"
                            keyboardType="phone-pad"
                            value={authData.phone}
                            onChangeText={(text) => setauthData({ ...authData, phone: text })}
                            style={styles.textInput}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            placeholder="Your Email"
                            keyboardType="email-address"
                            value={authData.email}
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    {/* City & Country */}
                    <View style={styles.locationInputContainer}>
                        <View style={styles.locationInputWrapper}>
                            <Text style={styles.inputLabel}>City</Text>
                            <TextInput
                                placeholder="Your City"
                                value={userdata.city}
                                onChangeText={(text) => setUserData({ ...userdata, city: text })}
                                style={styles.textInput}
                            />
                        </View>
                        <View style={styles.locationInputWrapper}>
                            <Text style={styles.inputLabel}>Country</Text>
                            <TextInput
                                placeholder="Your Country"
                                value={userdata.country}
                                onChangeText={(text) => setUserData({ ...userdata, country: text })}
                                style={styles.textInput}
                            />
                        </View>
                    </View>

                    {/* Terms and Conditions */}
                    <View style={styles.termsContainer}>
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            onValueChange={setIsChecked}
                            color={isChecked ? "#FFB700" : undefined}
                        />
                        <Text style={styles.termsText}>
                            I accept the <Text style={styles.termsLink}>Terms and Conditions</Text>
                        </Text>
                    </View>

                    {/* Error Message */}
                    <View style={styles.submitContainer}>
                        {(localError || error) && <Text style={styles.errorText}>{localError || error}</Text>}

                        {/* Submit Button */}
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
        backgroundColor: "#0F0F0F",
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
        backgroundColor: "#292929",
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepIndicator: {

        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#FFB700',
        padding: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
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
    nameInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginTop: 20,
    },
    nameInputWrapper: {
        width: '48%',
    },
    inputLabel: {
        fontWeight: '600',
        fontSize: 14,
        marginVertical: 8,
        color: '#FFFFFF',
    },
    textInput: {
        height: 50,
        backgroundColor: "#1F1F1F",
        borderColor: '#292929',
        color : "#FFFFFF",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
    },
    genderContainer: {
        marginTop: 10,
    },
    genderOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    genderOption: {
        borderColor: '#292929',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '30%',
        backgroundColor: '#1F1F1F',
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderOptionSelected: {
        backgroundColor: '#FFB700',
    },
    genderOptionText: {
        color: '#B0B0B0',
    },
    genderOptionTextSelected: {
        color: '#0F0F0F',
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop: 20,
    },
    locationInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        marginTop: 10,
    },
    locationInputWrapper: {
        width: '48%',
    },
    termsContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        borderColor: "#FFB700",
        borderRadius: 5,
        width: 20,
        height: 20,
        backgroundColor: '#1F1F1F',
    },
    termsText: {
        paddingLeft: 10,
        fontWeight: "500",
        color: '#B0B0B0',
    },
    termsLink: {
        color: "#FFB700",
        textDecorationLine: "underline",
    },
    buttonContainer: {
        marginBottom: 20,
        marginTop: 20,
    },
    continueButton: {
        width: '100%',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFB700',
        borderRadius: 8,
        shadowColor: '#FFB700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    submitButtonDisabled: {
        backgroundColor: '#B0B0B0',
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
