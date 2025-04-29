interface CommentTypes {
    _id: string;
    content: string;
    commenton: 'Video' | 'Post';
    postId: string;
    owner: {
        _id: string;
        username: string;
        profileimg: string;
    },
    likeCount: number,
    likedByCurrentUser: boolean
}
export default CommentTypes;