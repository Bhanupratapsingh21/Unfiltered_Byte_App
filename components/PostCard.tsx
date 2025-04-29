import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    CommentIcon,
    CustomShare,
} from "@/assets/icons/iconsheader";
import { Share } from 'react-native';

interface BlogCardProps {
    userImage?: string;
    userName: string;
    userDesignation: string;
    postImage?: string;
    caption: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
    onCommentPress?: () => void;
}

const { width } = Dimensions.get('window');

const BlogCard: React.FC<BlogCardProps> = ({
    userImage,
    userName,
    userDesignation,
    postImage,
    caption,
    likesCount,
    commentsCount,
    isLiked = false,
    onCommentPress
}) => {
    // Theme & state
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [imageAspectRatio, setImageAspectRatio] = useState<number>(1);
    const [imageLoading, setImageLoading] = useState<boolean>(true);

    const handleShare = async () => {
        try {
            await Share.share({
                title: 'Check this post!',
                message: caption + '\n\nSee more in our app!',
                url: postImage || undefined,
            });
        } catch (error) {
            console.error('Error sharing', error);
        }
    };

    // Theme colors
    const themeStyles = {
        container: {
            backgroundColor: isDark ? '#202020' : '#E9E9E9',
        },
        text: {
            color: isDark ? '#FFF' : '#000',
        },
        secondaryText: {
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
        },
        menuButton: {
            backgroundColor: isDark ? "#000000" : "#ffffff",
        },
        divider: {
            backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
        iconColor: isDark ? '#FFF' : '#000',
        activeIconColor: '#FF5252',
        shadow: isDark ? {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5,
        } : {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }
    };

    useEffect(() => {
        if (postImage) {
            Image.getSize(postImage, (width, height) => {
                if (width && height) {
                    setImageAspectRatio(width / height);
                }
            }, (error) => {
                console.error('Failed to get image size', error);
            });
        }
    }, [postImage]);

    return (
        <View style={[styles.container, themeStyles.container, themeStyles.shadow]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    {userImage && (
                        <Image source={{ uri: userImage }} style={styles.userImage} />
                    )}
                    <View style={styles.userText}>
                        <Text style={[styles.userName, themeStyles.text]}>{userName}</Text>
                        <Text style={[styles.userDesignation, themeStyles.secondaryText]}>{userDesignation}</Text>
                    </View>
                </View>
                <TouchableOpacity style={[styles.menuButton, themeStyles.menuButton]}>
                    <Ionicons name="ellipsis-vertical" size={20} color={themeStyles.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={[styles.divider, themeStyles.divider]} />

            {/* Post Image or Text */}
            {postImage ? (
                <View style={styles.imageContainer}>
                    {imageLoading && (
                        <View style={styles.loader}>
                            <ActivityIndicator size="small" color="#FFB700" />
                        </View>
                    )}
                    <Image
                        source={{ uri: postImage }}
                        style={{
                            width: '100%',
                            aspectRatio: imageAspectRatio,
                            borderRadius: 8,
                        }}
                        resizeMode="cover"
                        onLoadStart={() => setImageLoading(true)}
                        onLoadEnd={() => setImageLoading(false)}
                    />
                </View>
            ) : (
                <Text style={[styles.caption, themeStyles.text]}>{caption}</Text>
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <View style={styles.leftActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={24}
                            color={isLiked ? themeStyles.activeIconColor : themeStyles.iconColor}
                        />
                        <Text style={[styles.actionText, themeStyles.text]}>{likesCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={onCommentPress}>
                        <CommentIcon color={themeStyles.iconColor} />
                        <Text style={[styles.actionText, themeStyles.text]}>{commentsCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                        <CustomShare size={19} color={themeStyles.iconColor} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Caption Text after image */}
            {postImage && (
                <Text style={[styles.caption, themeStyles.text]}>{caption}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderColor: "#fff",
        borderWidth: 0.2,
        borderRadius: 12,
        marginBottom: 16,
        paddingBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userText: {
        flexDirection: 'column',
    },
    userName: {
        fontWeight: '600',
        fontSize: 14,
    },
    userDesignation: {
        fontSize: 12,
    },
    menuButton: {
        padding: 6,
        borderRadius: 30,
        borderColor: "#fff",
        borderWidth: 0.3,
    },
    divider: {
        height: 1,
        marginHorizontal: 12,
    },
    imageContainer: {
        width: '100%',
        marginTop: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    loader: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        zIndex: 1,
    },
    caption: {
        paddingHorizontal: 12,
        paddingTop: 8,
        fontSize: 12,
        lineHeight: 18,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
    },
    leftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 12,
    },
});

export default BlogCard;
