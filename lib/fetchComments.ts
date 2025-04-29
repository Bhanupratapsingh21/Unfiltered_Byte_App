import { GET_COMMENTS_URL } from "@/utils/ApiRoutes";
import axios from "axios";
const fetchComments = async (
    postId: string,
    page: number,
    setComments: (comments: any[]) => void,
    setCommentLoading: (value: boolean) => void,
    setCommentError: (error: string | null) => void,
    user: any,
    existingComments: any[] = []
) => {
    if (!postId) {
        console.error('Post ID is required to fetch comments.');
        setCommentError('Post ID is required to fetch comments');
        return;
    }

    setCommentLoading(true);

    try {
        const res = await axios.get(`${GET_COMMENTS_URL + postId}?page=${page}&limit=10`, {
            headers: user?.jwt ? { Authorization: `Bearer ${user.jwt}` } : {},
        });

        //console.log('Fetched comments:', res.data.data.Comments);
        const fetchedComments = res.data.data.Comments || [];

        if (page === 1) {
            setComments(fetchedComments);
        } else {
            setComments([...existingComments, ...fetchedComments]);
        }

        setCommentError(null);
    } catch (error: any) {
        setComments([]); // Reset comments on error
        if (error.response.data.statusCode === 404) {
            setCommentError('No comments found for this post. Let\'s be the first to comment!');
        }
        else {
            console.error('Error fetching comments:', error);
            setCommentError('Error fetching comments: ' + (error.message || 'Something went wrong!'));
        }
    } finally {
        setCommentLoading(false);
    }
};
export default fetchComments;  