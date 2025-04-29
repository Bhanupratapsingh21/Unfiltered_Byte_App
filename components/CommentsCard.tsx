import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CommentTypes from '@/types/Commentstypes';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { TOGGLE_LIKE_COMMENT_URL } from '@/utils/ApiRoutes'; // <-- Create this endpoint for comment likes

interface CommentCardProps {
  comment: CommentTypes;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const { user } = useAuthStore();

  const [liked, setLiked] = useState(comment.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [likeCooldown, setLikeCooldown] = useState(false);

  const toggleLike = async () => {
    if (likeCooldown) return;

    setLikeCooldown(true);
    setTimeout(() => setLikeCooldown(false), 1000); // 1 sec debounce

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => prev + (newLiked ? 1 : -1));

    try {
      await axios.get(`${TOGGLE_LIKE_COMMENT_URL}${comment._id}`, {
        headers: user?.jwt ? { Authorization: `Bearer ${user.jwt}` } : {},
        timeout: 5000,
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked(!newLiked);
      setLikeCount((prev) => prev - (newLiked ? 1 : -1));
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.owner.profileimg }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{comment.owner.username}</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>

        <TouchableOpacity style={styles.likeButton} onPress={toggleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? "#FF5A5F" : "#CCC"}
          />
          <Text style={styles.likeText}>{likeCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#555',
    marginRight: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  commentText: {
    color: '#DDD',
    fontSize: 13,
    marginTop: 2,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  likeText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#CCC',
  },
});

export default CommentCard;
