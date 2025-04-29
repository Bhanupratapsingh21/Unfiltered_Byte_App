const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const POSTS_API_URL = BASE_URL + "tweets/getblogsadv?q=newestfirst";
const API_URL2 = BASE_URL + "tweets/getblogsadv?q=mostlikedfirst";
const POST_COMMENTS_URL = BASE_URL + "comment/postcomment/Post/";
const GET_COMMENTS_URL = BASE_URL + "comment/getcomments/";
const TOGGLE_LIKE_URL = BASE_URL + "like/tweet/";
const TOGGLE_LIKE_COMMENT_URL = BASE_URL + "like/comment/";
export {
    POSTS_API_URL,
    API_URL2,
    POST_COMMENTS_URL,
    GET_COMMENTS_URL,
    TOGGLE_LIKE_URL,
    TOGGLE_LIKE_COMMENT_URL,
    // Add other API routes here as needed
}