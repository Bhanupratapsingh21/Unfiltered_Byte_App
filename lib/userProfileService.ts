import { useAuthStore } from '@/store/authStore';
import { databases } from './appwrite';
import UserProfile from "@/types/userprofile.types";
import { Query } from 'react-native-appwrite';

// Assert that environment variables are defined
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID as string;
const userProfileCollectionId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_USERPROFILECOLLECTION as string;

if (!databaseId || !userProfileCollectionId) {
    throw new Error("Missing required environment variables for Appwrite configuration");
}

interface UpdateData {
    username?: string,
    bio?: string,
    gender?: string,
    profilepicture?: string,
    country?: string,
    category?: string,
    skills_critaria?: string,
}

const UserProfileService = {
    /**
     * Create a new user profile
     * @param {UserProfile} profileData - User profile data
     * @returns {Promise<UserProfile>} Created profile
     */
    createUserProfile: async (profileData: UserProfile) => {
        try {
            // Validate required fields
            if (!profileData.userId || !profileData.username || !profileData.githubusername) {
                throw new Error('Missing required fields: userId, firstname, lastname');
            }

            return await databases.createDocument(
                databaseId,
                userProfileCollectionId,
                profileData.userId, // Using userId as document ID
                {
                    userId: profileData.userId,
                    username: profileData.username,
                    bio: profileData.bio || '',
                    githubusername: profileData.githubusername || '',
                    gender: profileData.gender || '',
                    profilepicture: profileData.profilepicture || '',
                    country: profileData.country || '',
                    category: profileData.category || '',
                    skills_critaria: profileData.skills_critaria || '',
                }
            );
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    },

    /**
     * Get user profile by userId
     * @param {string} userId - User ID
     * @returns {Promise<UserProfile | null>} User profile
     */
    getUserProfile: async (userId: string): Promise<UserProfile | null> => {
        try {
            const profile = await databases.getDocument(
                databaseId,
                userProfileCollectionId,
                userId
            );

            return {
                userId: profile.$id,
                username: profile.username,
                bio: profile.bio,
                gender: profile.gender,
                profilepicture: profile.profilepicture,
                country: profile.country,
                category: profile.category,
                skills_critaria: profile.skills_critaria,
                githubusername: profile.githubusername,
            };
        } catch (error: any) {
            // Handle case where profile doesn't exist
            if (error.code === 404) {
                return null;
            }
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    /**
     * Update user profile
     * @param {string} userId - User ID
     * @param {Partial<UserProfile>} updates - Fields to update
     * @returns {Promise<UserProfile>} Updated profile
     */
    updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
        try {
            // Create a properly typed update object
            const updateData: UpdateData = {};

            if (updates.username !== undefined) updateData.username = updates.username;
            if (updates.category !== undefined) updateData.category = updates.category;
            if (updates.bio !== undefined) updateData.bio = updates.bio;
            if (updates.country !== undefined) updateData.country = updates.country;
            if (updates.gender !== undefined) updateData.gender = updates.gender;
            if (updates.profilepicture !== undefined) updateData.profilepicture = updates.profilepicture;
            if (updates.skills_critaria !== undefined) updateData.skills_critaria = updates.skills_critaria;

            await databases.updateDocument(
                databaseId,
                userProfileCollectionId,
                userId,
                updateData
            );
            return updateData
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    /**
     * Delete user profile
     * @param {string} userId - User ID
     * @returns {Promise<void>}
     */
    deleteUserProfile: async (userId: string) => {
        try {
            await databases.deleteDocument(
                databaseId,
                userProfileCollectionId,
                userId
            );
        } catch (error) {
            console.error('Error deleting user profile:', error);
            throw error;
        }
    },

    /**
     * Check if profile exists and create if it doesn't
     * @param {UserProfile} profileData - User profile data
     * @returns {Promise<UserProfile>} Existing or newly created profile
     */
    ensureUserProfileExists: async (profileData: UserProfile) => {
        try {
            const existingProfile = await UserProfileService.getUserProfile(profileData.userId);
            if (existingProfile) {
                return existingProfile;
            }
            return await UserProfileService.createUserProfile(profileData);
        } catch (error) {
            console.error('Error ensuring profile exists:', error);
            throw error;
        }
    },
    isUsernameTaken: async (username: string): Promise<boolean> => {
        try {
            const result = await databases.listDocuments(
                databaseId,
                userProfileCollectionId,
                [Query.equal('username', username)]
            );

            return result.total > 0;
        } catch (error) {
            console.error('Error checking username:', error);
            throw error;
        }
    }
}

export default UserProfileService;