
interface Blog {
    _id: string;
    content: string;
    coverImageURL: string;
    toptitle: string;
    createdBy: {
      _id: string;
      username: string;
      profileimg: string;
    };
    commentCount: number;
    likeCount: number;
    likedByCurrentUser: boolean;
    subscribedByCurrentUser: boolean;
  };
  export default Blog; // Export the Blog interface for use in other files