import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import CommentTypes from '@/types/Commentstypes';

interface CommentCardProps {
  comment: CommentTypes;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: comment.owner.profileimg }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.username}>{comment.owner.username}</Text>
        <Text style={styles.commentText}>{comment.content}</Text>
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
});

export default CommentCard;
