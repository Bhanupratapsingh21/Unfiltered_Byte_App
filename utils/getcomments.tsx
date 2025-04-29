import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const fetchComments = async (postId: string, setComments: (comments: any[]) => void) => {
    const { user } = useAuthStore(); // Assuming you have a way to get the current user
    try {
        const res = await axios.get(`/api/v1/comment/getcomments/${postId}`, {
            headers: user?.jwt ? { Authorization: `Bearer ${user.jwt}` } : {},
        });
        setComments(res.data.data.comments || []);
    } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]); // fallback
    }
};

export default fetchComments;