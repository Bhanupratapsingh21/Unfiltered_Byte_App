import React, { useRef, useState } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { Link } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Stepone from "@/components/ProfileEdit/stepone";
import userdata from "@/types/userprofile.types";
import Steptwo from "@/components/profilebuild/steptwo";
import AboutYou from "@/types/aboutyoutypes";
import ThankYouScreen from "@/components/CompleteScreen";
import { useAuthStore } from "@/store/authStore";
import Authdata from "@/types/authdata.types";
import UserProfileService from "@/lib/userProfileService";

export default function Indexscreen() {
  const userprofile = useAuthStore(state => state.userProfile);
  const user = useAuthStore(state => state.user);
  const setuserprofile = useAuthStore(state => state.setuserProfile);

  const [authData, setauthData] = useState<Authdata>({
    email: user?.email || "",
  });

  const [userdata, setuserData] = useState<userdata>({
    userId: userprofile?.userId || "",
    username: userprofile?.username || "",
    bio: userprofile?.bio || "",
    gender: userprofile?.gender || "",
    category: userprofile?.category || "",
    country: userprofile?.country || "",
    skills_critaria: userprofile?.skills_critaria || "",
    profilepicture: userprofile?.profilepicture || "",
    githubusername: userprofile?.githubusername || "",
  });

  const [aboutyou, setAboutYou] = useState<AboutYou>({
    "Have you ever worked on your mental health?": "",
    "How do you usually cope with stress?": "",
    "Have you ever practiced meditation or mindfulness?": "",
    "Do you have a support system (friends, family, therapist)?": "",
    "How often do you prioritize self-care?": "",
    "Have you ever talked to a professional about your mental health?": "",
    "What activities make you feel happy and relaxed?": "",
    "How would you describe your sleep quality?": "",
    "Do you feel comfortable expressing your emotions?": "",
    "What are some personal goals you have for your mental well-being?": ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!userdata.userId) {
      setError("User ID is missing");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Prepare updates object
      const updates: Partial<userdata> = {};
      if (userdata.username) updates.username = userdata.username;
      if (userdata.bio) updates.bio = userdata.bio;
      if (userdata.githubusername) updates.githubusername = userdata.githubusername;
      if (userdata.profilepicture) updates.profilepicture = userdata.profilepicture;
      if (userdata.category) updates.category = userdata.category;
      if (userdata.skills_critaria) updates.skills_critaria = userdata.skills_critaria;
      if (userdata.gender) updates.gender = userdata.gender;
      if (userdata.country) updates.country = userdata.country;

      // Call Appwrite service
      const updatedProfile = await UserProfileService.updateUserProfile(userdata.userId, updates);

      setuserprofile({
        ...userprofile,
        ...updates,
        userId: userdata.userId, // Ensure userId is always defined
        username: userdata.username || "",
        bio: userdata.bio || "",
        profilepicture: userdata.profilepicture || "",
        category: userdata.category || "",
        skills_critaria: userdata.skills_critaria || "",
        githubusername: userdata.githubusername || "",
        gender: userdata.gender || "",
        country: userdata.country || "",
      });

      // Optional: Show success message or navigate
      //"Profile updated successfully");
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: "black" }}
      className="flex-1"
    >
      <Stepone
        authData={authData}
        setauthData={setauthData}
        userdata={userdata}
        setUserData={setuserData}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </KeyboardAvoidingView>
  );
}