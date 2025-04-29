import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import CommentTypes from '@/types/Commentstypes';
import { POST_COMMENTS_URL } from '@/utils/ApiRoutes';
interface CommentInputProps {
    postId: string | undefined;
    commentOn: 'Post' | 'Video';
    setComments?: React.Dispatch<React.SetStateAction<CommentTypes[]>>;
}

const CommentInput: React.FC<CommentInputProps> = ({ postId, commentOn, setComments }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, userProfile } = useAuthStore(); // assume user contains _id, username, profileimg


    const handleSubmit = async () => {
        if (!content.trim()) return;
        //console.log(userProfile)
        setLoading(true);
        try {
            const payload = {
                content,
                commenton: commentOn,
                postId,
                owner: {
                    _id: userProfile?.userId, // assuming you have $id or id
                    username: userProfile?.username,
                    profileimg: userProfile?.profilepicture,
                }
            };

            // Replace with your API endpoint for posting comment
            await axios.post(`${POST_COMMENTS_URL + postId}`, payload, {
                headers: user?.jwt ? { Authorization: `Bearer ${user.jwt}` } : {},
            });

            setContent(''); // Clear input
            if (setComments) setComments((prevComments) => [...prevComments, payload as CommentTypes]); // Update comments state if provided
        } catch (error) {
            //console.log(error.response);
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
                style={styles.input}
                editable={!loading}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Post</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',

    },
    input: {
        flex: 1,
        color: '#FFF',
        fontSize: 14,
        paddingHorizontal: 12,
        paddingVertical: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 20,
        marginRight: 8,
    },
    button: {
        backgroundColor: '#FFB700',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
    },
    buttonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default CommentInput;
