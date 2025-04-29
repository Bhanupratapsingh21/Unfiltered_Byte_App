const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const POSTS_API_URL = BASE_URL + "tweets/getblogsadv?q=newestfirst";
const API_URL2 = BASE_URL + "tweets/getblogsadv?q=mostlikedfirst";

export {
    POSTS_API_URL,
    API_URL2,
    // Add other API routes here as needed
}