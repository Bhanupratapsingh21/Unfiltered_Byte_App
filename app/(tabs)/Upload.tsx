import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    ScrollView,
    Switch,
    Platform,
} from 'react-native';
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import * as Progress from 'react-native-progress';
import { User } from '@/types/auth.types';

// Define interfaces
interface ImagePickerAsset {
    uri: string;
    type?: string;
    name?: string;
    width?: number;
    height?: number;
    fileSize?: number;
}

interface CloudinaryResponse {
    url: string;
    public_id: string;
}

// Constants
const CLOUDINARY_URL = process.env.EXPO_PUBLIC_CLOUDINARY_URL || "https://api.cloudinary.com/v1_1/dhvkjanwa/image/upload";
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_UPLOAD_PRESET || "unfilterbytepreset";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.9:4000";

const TweetPostScreen = () => {
    // State variables
    const router = useRouter();
    const [content, setContent] = useState('');
    const [topTitle, setTopTitle] = useState('');
    const [tags, setTags] = useState<string>("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [coverImage, setCoverImage] = useState<ImagePickerAsset | null>(null);
    const [cloudinaryImageData, setCloudinaryImageData] = useState<CloudinaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');
    const [networkStatus, setNetworkStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
    const user = useAuthStore((state) => state.user) as User | null;

    // Check permissions on component mount
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

                if (galleryStatus !== 'granted' || cameraStatus !== 'granted') {
                    Alert.alert(
                        'Permissions Required',
                        'Please grant camera and photo library permissions to use this feature.',
                        [{ text: 'OK' }]
                    );
                }
            }

            // Simple network check
            try {
                await fetch('https://www.cloudinary.com', { method: 'HEAD' });
                setNetworkStatus('connected');
            } catch (error) {
                setNetworkStatus('disconnected');
                console.log('Network check failed:', error);
            }
        })();
    }, []);

    const pickImage = async (source: 'camera' | 'gallery') => {
        if (networkStatus === 'disconnected') {
            Alert.alert('Network Error', 'Please check your internet connection');
            return;
        }

        let result: ImagePicker.ImagePickerResult;
        try {
            if (source === 'camera') {
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false, // Disable cropping
                    quality: 1, // Full quality
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false, // Disable cropping
                    quality: 1, // Full quality
                });
            }

            if (!result.canceled && result.assets && result.assets[0]) {
                // Check file size
                const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
                if (fileInfo.exists && fileInfo.size && fileInfo.size > MAX_FILE_SIZE) {
                    Alert.alert('File Too Large', 'Please select an image under 10MB');
                    return;
                }

                setCoverImage(result.assets[0]);
                setCloudinaryImageData(null);
                setError('');
            }
        } catch (err) {
            console.error('Error picking image:', err);
            setError('Failed to select image');
        }
    };

    // Function to upload image to Cloudinary
    const uploadImageToCloudinary = async (image: ImagePickerAsset): Promise<CloudinaryResponse> => {
        if (!image || !image.uri) {
            throw new Error('No image selected');
        }

        setUploadProgress(0);

        // Create form data
        const formData = new FormData();
        formData.append('upload_preset', UPLOAD_PRESET);

        // Get file extension and name
        const uriParts = image.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `upload_${Date.now()}.${fileExtension}`;



        // Append file to form with proper format for React Native
        formData.append('file', {
            uri: image.uri,
            type: `image/${fileExtension}`,
            name: fileName,
        } as any);

        try {


            // Make POST request to Cloudinary
            const response = await axios.post(CLOUDINARY_URL, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data) => data, // Important for FormData in RN
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                        setUploadProgress(progress);

                    }
                },
            });

            // Return URL and public_id
            return {
                url: response.data.secure_url,
                public_id: response.data.public_id,
            };
        } catch (error) {
            // Enhanced error logging
            console.error('Cloudinary upload failed:', error);

            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.response?.data);
                throw new Error(
                    `Upload failed (${error.response?.status}): ${error.response?.data?.error?.message || 'Unknown error'
                    }`
                );
            }

            throw error;
        }
    };

    // Alternative upload using fetch API
    const uploadWithFetch = async (image: ImagePickerAsset): Promise<CloudinaryResponse> => {
        if (!image || !image.uri) {
            throw new Error('No image selected');
        }

        setUploadProgress(0);

        // Create form data
        const formData = new FormData();
        formData.append('upload_preset', UPLOAD_PRESET);

        // Get file extension and name
        const uriParts = image.uri.split('.');
        const fileExtension = uriParts[uriParts.length - 1];
        const fileName = `upload_${Date.now()}.${fileExtension}`;

        // Append file to form
        formData.append('file', {
            uri: image.uri,
            type: `image/${fileExtension}`,
            name: fileName,
        } as any);

        try {

            // Make POST request using fetch
            const response = await axios.post(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                },
            });

            // Check if response is ok
            if (response.status < 200 || response.status >= 300) {
                throw new Error(`Upload failed: ${response.status} - ${response.statusText}`);
            }

            // Parse response
            const data = response.data;
            // Return URL and public_id
            return {
                url: data.secure_url,
                public_id: data.public_id,
            };
        } catch (error) {
            console.error('Upload with fetch failed:', error);
            throw error;
        }
    };

    // Function to remove selected image
    const removeImage = () => {
        setCoverImage(null);
        setCloudinaryImageData(null);
        setError('');
    };

    // Function to handle post creation
    const handlePostTweet = async () => {
        // Validate input
        if (!content.trim()) {
            setError('Content is required');
            return;
        }

        if (!user) {
            setError('User not authenticated');
            return;
        }

        // Check network status
        if (networkStatus === 'disconnected') {
            Alert.alert('Network Error', 'Please check your internet connection');
            return;
        }

        // Set loading state
        setLoading(true);
        setError('');
        setUploadProgress(0);

        try {
            let imageData = cloudinaryImageData;

            // Upload image if not already uploaded
            if (coverImage && !cloudinaryImageData) {
                try {
                    // Try axios upload first
                    try {
                        imageData = await uploadImageToCloudinary(coverImage);
                    } catch (axiosError) {
                        console.log('Axios upload failed, trying fetch...');
                        // Fallback to fetch if axios fails
                        imageData = await uploadWithFetch(coverImage);
                    }

                    setCloudinaryImageData(imageData);

                } catch (uploadError) {
                    console.error('Image upload error:', uploadError);
                    setError(uploadError instanceof Error ? uploadError.message : 'Image upload failed');
                    setLoading(false);
                    return;
                }
            }

            // Prepare tweet data
            const tweetData = {
                content,
                toptitle: topTitle,
                tags,
                isAnonymous,
                coverImageURL: imageData?.url || '',
            };

            // Send post request to backend
            const response = await axios.post(`${API_URL}tweets/uploadblog`, tweetData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.jwt}`,
                },
                timeout: 10000, // 10 second timeout
            });


            // Show success message and redirect
            Alert.alert(
                'Success',
                'Post created successfully!',
                [{ text: 'OK', onPress: () => router.push('/') }]
            );
        } catch (err) {
            console.error('Error posting tweet:', err);

            if (axios.isAxiosError(err)) {
                console.error('Status:', err.response?.status);
                console.error('Data:', err.response?.data);

                if (err.code === 'ECONNABORTED') {
                    setError('Request timed out. Please try again.');
                } else if (!err.response) {
                    setError('Network error. Please check your connection.');
                } else {
                    setError(err.response?.data?.message || 'Failed to post tweet');
                }
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
            setUploadProgress(0);
            setContent('');
            setTopTitle('');
            setCoverImage(null);
            setCloudinaryImageData(null);
            setIsAnonymous(false);
            setError('');
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {/* Network Status Indicator */}
            {networkStatus === 'disconnected' && (
                <View style={styles.networkWarning}>
                    <Text style={styles.networkWarningText}>
                        ⚠️ No internet connection. Please check your network settings.
                    </Text>
                </View>
            )}

            <Text style={styles.title}>Create New Post</Text>

            {/* Anonymous Toggle */}
            <View style={styles.anonymousContainer}>
                <Text style={styles.anonymousText}>Post Anonymously</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#FFB700' }}
                    thumbColor={isAnonymous ? '#f4f3f4' : '#f4f3f4'}
                    onValueChange={() => setIsAnonymous(!isAnonymous)}
                    value={isAnonymous}
                />
            </View>

            {/* Top Title Input */}
            <TextInput
                style={styles.input}
                placeholder="Your Mood, Location or event"
                placeholderTextColor="#666"
                value={topTitle}
                onChangeText={setTopTitle}
            />

            {/* Tags Input */}
            <TextInput
                style={styles.input}
                placeholder="Tags (comma separated)"
                placeholderTextColor="#666"
                value={tags}
                onChangeText={setTags}
            />


            {/* Content Input */}
            <TextInput
                style={[styles.input, styles.contentInput]}
                placeholder="What's on your mind? Caption..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                value={content}
                onChangeText={setContent}
            />

            {/* Image Preview */}
            {coverImage && (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: coverImage.uri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Show Cloudinary status */}
                    {cloudinaryImageData && (
                        <View style={styles.cloudinaryBadge}>
                            <Text style={styles.cloudinaryText}>✓ Uploaded to Cloud</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Image Picker Buttons */}
            <View style={styles.imagePickerContainer}>
                <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage('camera')}
                    disabled={loading}
                >
                    <Ionicons name="camera" size={24} color="#FFB700" />
                    <Text style={styles.imageButtonText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.imageButton}
                    onPress={() => pickImage('gallery')}
                    disabled={loading}
                >
                    <Ionicons name="image" size={24} color="#FFB700" />
                    <Text style={styles.imageButtonText}>Gallery</Text>
                </TouchableOpacity>
            </View>

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
                <View style={styles.progressContainer}>
                    <Progress.Bar
                        progress={uploadProgress / 100}
                        width={null}
                        color="#FFB700"
                        borderRadius={5}
                        height={10}
                    />
                    <Text style={styles.progressText}>{uploadProgress}%</Text>
                </View>
            )}

            {/* Error Message */}
            {error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
                style={[
                    styles.postButton,
                    (loading || networkStatus === 'disconnected') && styles.disabledButton
                ]}
                onPress={handlePostTweet}
                disabled={loading || networkStatus === 'disconnected'}
            >
                {loading ? (
                    <ActivityIndicator color="#0F0F0F" size="small" />
                ) : (
                    <Text style={styles.postButtonText}>Post</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
        padding: 16,
    },
    contentContainer: {
        paddingBottom: 650,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
        textAlign: 'center',
    },
    anonymousContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 12,
        backgroundColor: '#1C1C1E',
        borderRadius: 10,
    },
    anonymousText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1C1C1E',
        color: '#FFFFFF',
        borderRadius: 10,
        padding: 15,
        height: "auto",
        marginBottom: 15,
        fontSize: 16,
    },
    contentInput: {
        minHeight: 200,
        height: 'auto',
        textAlignVertical: 'top',
    },
    imagePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    imageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1C1C1E',
        padding: 12,
        borderRadius: 10,
        width: '45%',
        justifyContent: 'center',
    },
    imageButtonText: {
        color: '#FFB700',
        marginLeft: 8,
        fontSize: 16,
    },
    imagePreviewContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    imagePreview: {
        width: '100%',
        height: "100%",
        borderRadius: 10,
    },
    removeImageButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cloudinaryBadge: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 15,
        padding: 8,
    },
    cloudinaryText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
    },
    postButton: {
        backgroundColor: '#FFB700',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#6e5200',
        opacity: 0.7,
    },
    postButtonText: {
        color: '#0F0F0F',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorContainer: {
        backgroundColor: 'rgba(255, 59, 48, 0.2)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    errorText: {
        color: '#FF3B30',
        textAlign: 'center',
    },
    progressContainer: {
        marginVertical: 15,
        width: '100%',
    },
    progressText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 5,
    },
    networkWarning: {
        backgroundColor: 'rgba(255, 183, 0, 0.2)',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
    },
    networkWarningText: {
        color: '#FFB700',
        textAlign: 'center',
    },
});

export default TweetPostScreen;