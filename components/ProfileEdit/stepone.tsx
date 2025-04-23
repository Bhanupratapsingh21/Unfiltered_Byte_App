// ✅ Full StepOne Cyberpunk styled ✅
import React, { useEffect, useState } from "react";
import {
    View,
    Pressable,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    ScrollView,
    Modal,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { BlurView } from "expo-blur";
import userdata from "@/types/userprofile.types";
import LogoutIcon from "@/assets/icons/Logout";
import { useAuthStore } from "@/store/authStore";
import Authdata from "@/types/authdata.types";
import UserProfileService from "@/lib/userProfileService";

interface OtpScreenProps {
    authData: Authdata;
    userdata: userdata;
    setauthData: (authData: Authdata) => void;
    setUserData: (userdata: userdata) => void;
    onSubmit: () => Promise<void>;
    loading: boolean;
    error: string;
}

export default function Stepone({
    userdata,
    authData,
    onSubmit,
    loading,
    error,
    setauthData,
    setUserData,
}: OtpScreenProps) {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profileImage, setProfileImage] = useState(
        require("@/assets/images/chatlogo.png")
    );
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const clearAuth = useAuthStore((state) => state.clearAuth);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await clearAuth();
            router.replace("/auth");
        } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Logout Error", "Failed to logout. Please try again.");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await onSubmit();
            Alert.alert("Success", "Profile updated successfully");
        } catch (err) {
            console.error("Submit error:", err);
        }
    };
    const [isChecked, setIsChecked] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [fetchingGithub, setFetchingGithub] = useState(false);
    const [usernameUnique, setUsernameUnique] = useState(false);
    const [checkingUsername, setCheckingUsername] = useState(false);






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
                    {/* Header */}
                    <View style={styles.headerContainer}>
                        <Pressable onPress={() => router.back()} style={styles.backButton}>
                            <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
                        </Pressable>
                        <Pressable
                            onPress={() => setShowLogoutModal(true)}
                            style={styles.logoutButton}
                        >
                            <LogoutIcon />
                        </Pressable>
                    </View>

                    {/* Profile Image */}
                    <View style={styles.profileSection}>
                        <View style={styles.profileImageContainer}>
                            <Image style={styles.profileImage} source={{ uri: userdata.profilepicture }} />
                            <Pressable
                                onPress={() =>
                                    Alert.alert("Coming Soon", "This Feature will be added Soon")
                                }
                                style={styles.cameraButton}
                            >
                                <FontAwesome name="camera" size={16} color="#FFFFFF" />
                            </Pressable>
                        </View>
                    </View>

                    {/* GitHub Username */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>GitHub Username</Text>
                        <TextInput
                            placeholderTextColor={"#B0B0B0"}
                            placeholder="Your GitHub username"
                            value={userdata.githubusername}
                            editable={false}
                            onChangeText={(text) => setUserData({ ...userdata, githubusername: text })}
                            style={[styles.textInput, { flex: 1 }]}
                        />
                    </View>

                    {/* Username */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            placeholderTextColor={"#B0B0B0"}
                            placeholder="Choose a username"
                            value={userdata.username}
                            editable={false}
                            onChangeText={(text) => setUserData({ ...userdata, username: text })}
                            style={[styles.textInput, { flex: 1 }]}
                        />
                    </View>

                    {/* Bio */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Bio</Text>
                        <TextInput
                            placeholderTextColor={"#B0B0B0"}
                            placeholder="Tell us about yourself"
                            value={userdata.bio}
                            onChangeText={(text) => setUserData({ ...userdata, bio: text })}
                            style={[styles.textInput, { height: "auto" }]}
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
                                        userdata.gender === gender && styles.genderOptionSelected,
                                    ]}
                                    onPress={() => setUserData({ ...userdata, gender })}
                                >
                                    <FontAwesome
                                        name={
                                            gender === "male"
                                                ? "mars"
                                                : gender === "female"
                                                    ? "venus"
                                                    : "genderless"
                                        }
                                        size={20}
                                        color={userdata.gender === gender ? "#FFFFFF" : "#B0B0B0"}
                                    />
                                    <Text
                                        style={[
                                            styles.genderOptionText,
                                            userdata.gender === gender &&
                                            styles.genderOptionTextSelected,
                                        ]}
                                    >
                                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Email</Text>
                        <TextInput
                            placeholder="Your Email"
                            placeholderTextColor="#666"
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

                    {/* Error message */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {/* Submit */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.submitButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                    {/* Logout Modal */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={showLogoutModal}
                        onRequestClose={() => setShowLogoutModal(false)}
                    >
                        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContainer}>
                                    <Text style={styles.modalTitle}>Logout Confirmation</Text>
                                    <Text style={styles.modalMessage}>
                                        Are you sure you want to logout?
                                    </Text>

                                    <View style={styles.modalButtonContainer}>
                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.cancelButton]}
                                            onPress={() => setShowLogoutModal(false)}
                                            disabled={isLoggingOut}
                                        >
                                            <Text style={styles.cancelButtonText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.modalButton, styles.logoutConfirmButton]}
                                            onPress={handleLogout}
                                            disabled={isLoggingOut}
                                        >
                                            {isLoggingOut ? (
                                                <ActivityIndicator color="#FFFFFF" />
                                            ) : (
                                                <Text style={styles.logoutConfirmButtonText}>
                                                    Yes, Logout
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </BlurView>
                    </Modal>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F0F", // Dark cyberpunk background
        marginBottom: 70,
    },
    scrollViewContent: {
        flexGrow: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#292929',
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutButton: {
        backgroundColor: '#292929',
        padding: 8,
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileSection: {
        marginTop: 20,
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'relative',
    },
    profileImage: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#FFB700",
    },
    cameraButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#FFB700',
        borderRadius: 20,
        padding: 5,
        borderWidth: 1,
        borderColor: '#292929',
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
        fontWeight: '800',
        fontSize: 14,
        marginVertical: 8,
        color: '#FFFFFF',
    },
    textInput: {
        height: 50,
        backgroundColor: '#1F1F1F',
        borderColor: '#292929',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        color: '#FFFFFF',
    },
    genderContainer: {
        marginTop: 20,
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
        color: '#FFFFFF',
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
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20,
    },
    submitButton: {
        backgroundColor: '#FFB700',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#0F0F0F',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#1F1F1F",
        borderRadius: 20,
        padding: 25,
        width: "80%",
        alignItems: "center",
        shadowColor: "#FFB700",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#FFFFFF",
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "#B0B0B0",
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 120,
    },
    cancelButton: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: '#FFB700',
        marginRight: 10,
    },
    cancelButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FFB700',
    },
    logoutConfirmButton: {
        backgroundColor: '#FFB700',
        marginLeft: 10,
    },
    logoutConfirmButtonText: {
        textAlign: 'center',
        color: '#0F0F0F',
        fontWeight: 'bold',
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
    submitButtonDisabled: {
        backgroundColor: '#B0B0B0',
    },

});
