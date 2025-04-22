// Import Alert if you want to show pop-up, or continue with Text error
import React, { useState, useEffect } from "react";
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
import UserProfileService from "@/lib/userProfileService";
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
    const [fetchingGithub, setFetchingGithub] = useState(false);
    const [usernameUnique, setUsernameUnique] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);


    useEffect(() => {
        if (userdata.githubusername) {
            const timeoutId = setTimeout(() => {
                fetchGithubData();
            }, 1000); // 1 second debounce delay

            // Cleanup function to clear the timeout if the effect runs again before the timeout completes
            return () => clearTimeout(timeoutId);
        }
    }, [userdata.githubusername]);

    const checkusernameUnique = async (username: string) => {
        setCheckingUsername(true);
        const response = await UserProfileService.isUsernameTaken(username);
        if (response) {
            Alert.alert("Username already taken", "Please choose a different username.");
            setUserData({ ...userdata, username: "" });
            setUsernameUnique(false);
        } else {
            setUsernameUnique(true);
        }
        setCheckingUsername(false);
        return response;
    };

    useEffect(() => {
        if (userdata.username) {
            const timeoutId = setTimeout(() => {
                checkusernameUnique(userdata.username);
            }, 1000); // 1 second debounce delay

            // Cleanup function to clear the timeout if the effect runs again before the timeout completes
            return () => clearTimeout(timeoutId);
        }
    }, [userdata.username]);

    const fetchGithubData = async () => {
        if (!userdata.githubusername) return;

        try {
            setFetchingGithub(true);
            const response = await fetch(`https://api.github.com/users/${userdata.githubusername}`);
            if (!response.ok) throw new Error("GitHub user not found");

            const data = await response.json();

            // Update user data with GitHub info
            setUserData({
                ...userdata,
                profilepicture: data.avatar_url || userdata.profilepicture,
                bio: data.bio || userdata.bio,
                country: data.location || userdata.country,
                username: data.login || userdata.username
            });
        } catch (error) {
            console.error("Failed to fetch GitHub data:", error);
            setLocalError("Could not fetch GitHub user. Please check the username.");
        } finally {
            setFetchingGithub(false);
        }
    };

    const validateAndSubmit = () => {
        if (!userdata.username.trim()) {
            setLocalError("Username is required.");
            return;
        }
        if (!userdata.gender.trim()) {
            setLocalError("Please select your gender.");
            return;
        }
        if (!userdata.bio.trim()) {
            setLocalError("Bio is required.");
            return;
        }
        if (!userdata.country.trim()) {
            setLocalError("Country is required.");
            return;
        }
        if (!userdata.category.trim()) {
            setLocalError("Please select your category.");
            return;
        }
        if (!userdata.skills_critaria.trim()) {
            setLocalError("Please select your skill level.");
            return;
        }
        if (!isChecked) {
            setLocalError("You must accept the Terms and Conditions.");
            return;
        }

        setLocalError(null);
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


                    {/* GitHub Username */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>GitHub Username</Text>
                        <View style={styles.githubContainer}>
                            <TextInput
                                placeholderTextColor={"#B0B0B0"}
                                placeholder="Your GitHub username"
                                value={userdata.githubusername}
                                onChangeText={(text) => setUserData({ ...userdata, githubusername: text })}
                                style={[styles.textInput, { flex: 1 }]}
                            />
                            <TouchableOpacity
                                style={styles.githubButton}
                                onPress={fetchGithubData}
                                disabled={fetchingGithub || !userdata.githubusername}
                            >
                                {fetchingGithub ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.githubButtonText}>Fetch</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Username */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <View style={styles.githubContainer}>
                            <TextInput
                                placeholderTextColor={"#B0B0B0"}
                                placeholder="Choose a username"
                                value={userdata.username}
                                onChangeText={(text) => setUserData({ ...userdata, username: text })}
                                style={[styles.textInput, { flex: 1 }]}
                            />
                            {checkingUsername ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : usernameUnique ? (
                                <FontAwesome name="check" size={24} color="green" />
                            ) : (
                                <FontAwesome name="times" size={24} color="red" />
                            )}
                        </View>

                    </View>

                    {/* Bio */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Bio</Text>
                        <TextInput
                            placeholderTextColor={"#B0B0B0"}
                            placeholder="Tell us about yourself"
                            value={userdata.bio}
                            onChangeText={(text) => setUserData({ ...userdata, bio: text })}
                            style={[styles.textInput, { height: 80 }]}
                            multiline
                        />
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
                                    {gender === "male" && <FontAwesome name="mars" size={20} color={userdata.gender === gender ? "white" : "white"} />}
                                    {gender === "female" && <FontAwesome name="venus" size={20} color={userdata.gender === gender ? "white" : "white"} />}
                                    {gender === "other" && <FontAwesome name="genderless" size={20} color={userdata.gender === gender ? "white" : "white"} />}
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
                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            placeholderTextColor={"#B0B0B0"}
                            placeholder="Your Email"
                            keyboardType="email-address"
                            value={authData.email}
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    {/* Country */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Country</Text>
                        <TextInput
                            placeholder="Your Country"
                            placeholderTextColor={"#B0B0B0"}
                            value={userdata.country}
                            onChangeText={(text) => setUserData({ ...userdata, country: text })}
                            style={styles.textInput}
                        />
                    </View>


                    {/* Category Selection */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Category</Text>
                        <View style={styles.categoryOptionsContainer}>
                            {["student", "developer"].map((category) => (
                                <Pressable
                                    key={category}
                                    style={[
                                        styles.categoryOption,
                                        userdata.category === category && styles.categoryOptionSelected
                                    ]}
                                    onPress={() => setUserData({ ...userdata, category })}
                                >
                                    <Text style={[
                                        styles.categoryOptionText,
                                        userdata.category === category && styles.categoryOptionTextSelected
                                    ]}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Skills Criteria */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Skill Level</Text>
                        <View style={styles.skillsOptionsContainer}>
                            {userdata.category === "developer" ? (
                                ["1x", "10x", "100x"].map((skill) => (
                                    <Pressable
                                        key={skill}
                                        style={[
                                            styles.skillOption,
                                            userdata.skills_critaria === skill && styles.skillOptionSelected
                                        ]}
                                        onPress={() => setUserData({ ...userdata, skills_critaria: skill })}
                                    >
                                        <Text style={[
                                            styles.skillOptionText,
                                            userdata.skills_critaria === skill && styles.skillOptionTextSelected
                                        ]}>
                                            {skill}
                                        </Text>
                                    </Pressable>
                                ))
                            ) : (
                                ["beginner", "inter", "pro"].map((skill) => (
                                    <Pressable
                                        key={skill}
                                        style={[
                                            styles.skillOption,
                                            userdata.skills_critaria === skill && styles.skillOptionSelected
                                        ]}
                                        onPress={() => setUserData({ ...userdata, skills_critaria: skill })}
                                    >
                                        <Text style={[
                                            styles.skillOptionText,
                                            userdata.skills_critaria === skill && styles.skillOptionTextSelected
                                        ]}>
                                            {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                        </Text>
                                    </Pressable>
                                ))
                            )}
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
    inputContainer: {
        marginTop: 20,
    },
    inputLabel: {
        fontWeight: '600',
        fontSize: 14,
        marginVertical: 8,
        color: '#FFFFFF',
    },
    textInput: {
        color: '#FFFFFF',
        height: 50,
        backgroundColor: "#1F1F1F",
        borderColor: '#292929',

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
    githubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    githubButton: {
        backgroundColor: '#FFB700',
        padding: 10,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    githubButtonText: {
        color: '#0F0F0F',
        fontWeight: '600',
    },
    categoryOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    categoryOption: {
        borderColor: '#292929',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        flex: 1,
        backgroundColor: '#1F1F1F',
        alignItems: 'center',
    },
    categoryOptionSelected: {
        backgroundColor: '#FFB700',
    },
    categoryOptionText: {
        color: '#B0B0B0',
    },
    categoryOptionTextSelected: {
        color: '#0F0F0F',
        fontWeight: 'bold',
    },
    skillsOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    skillOption: {
        borderColor: '#292929',
        borderWidth: 1,
        borderRadius: 10,
        padding: 15,
        flex: 1,
        backgroundColor: '#1F1F1F',
        alignItems: 'center',
    },
    skillOptionSelected: {
        backgroundColor: '#FFB700',
    },
    skillOptionText: {
        color: '#B0B0B0',
    },
    skillOptionTextSelected: {
        color: '#0F0F0F',
        fontWeight: 'bold',
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