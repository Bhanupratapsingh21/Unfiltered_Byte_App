import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ImageSourcePropType,
    useColorScheme
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    HeartIcon, BookmarkIcon,
    CrossIcon, CommentIcon,
    BookmarkIconInfo,
    CustomShare,
} from "@/assets/icons/iconsheader"

interface BlogCardProps {
    userImage?: string;
    userName: string;
    userDesignation: string;
    postImage?: string;
    caption: string;
    likesCount: number;
    commentsCount: number;
    isLiked?: boolean;
}

const { width } = Dimensions.get('window');

const onLikePress = () => { }
const onCommentPress = () => { }
const onSharePress = () => { }
const onMenuPress = () => { }

const BlogCard: React.FC<BlogCardProps> = ({
    userImage,
    userName,
    userDesignation,
    postImage,
    caption,
    likesCount,
    commentsCount,
    isLiked = false,
}) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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
        activeIconColor: isDark ? '#FF5252' : '#FF5252',
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

    return (
        <View style={[styles.container, themeStyles.container, themeStyles.shadow]}>
            {/* Header with user info and menu */}
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
                <TouchableOpacity onPress={onMenuPress} style={[styles.menuButton, themeStyles.menuButton]}>
                    <Ionicons name="ellipsis-vertical" size={20} color={themeStyles.iconColor} />
                </TouchableOpacity>
            </View>

            {/* Divider line */}
            <View style={[styles.divider, themeStyles.divider]} />

            {/* Post image with aspect ratio maintained */}
            {
                postImage && <Image
                    source={{ uri: postImage }}
                    style={styles.postImage}
                    resizeMode="cover"
                />
            }
            {
                !postImage && <Text style={[styles.caption, themeStyles.text]}>{caption}</Text>
            }
            {/* Action buttons */}
            <View style={styles.actionsContainer}>
                <View style={styles.leftActions}>
                    <TouchableOpacity onPress={onLikePress} style={styles.actionButton}>

                        <Ionicons
                            name={isLiked ? "heart" : "heart-outline"}
                            size={24}
                            color={isLiked ? themeStyles.activeIconColor : themeStyles.iconColor}
                        />
                        <Text style={[styles.actionText, themeStyles.text]}>{likesCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onCommentPress} style={styles.actionButton}>
                        <CommentIcon
                            color={themeStyles.iconColor}
                        />
                        <Text style={[styles.actionText, themeStyles.text]}>{commentsCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onSharePress} style={styles.actionButton}>
                        <CustomShare
                            size={19}
                            color={themeStyles.iconColor}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            {
                postImage && <Text style={[styles.caption, themeStyles.text]}>{caption}</Text>
            }
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
    postImage: {
        width: '100%',
        height: width * 0.8, // Maintain aspect ratio (4:5)
        marginTop: 8,
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