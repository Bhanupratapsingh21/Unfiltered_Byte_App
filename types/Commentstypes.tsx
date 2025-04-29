interface CommentTypes {
    content: string;
    commenton: 'Video' | 'Post';
    postId: string;
    owner: {
        _id: string;
        username: string;
        profileimg: string;
    }
}
export default CommentTypes;