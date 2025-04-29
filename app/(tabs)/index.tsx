import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList, BottomSheetFooter, BottomSheetFooterContainer } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  FlatList,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import StreakCard from "@/components/Home/StreakCard";
import BlogCard from "@/components/PostCard";
import Header from "@/components/Header";
import Spinner from "@/components/LoadingCircle";
import Tegs from "@/components/Services Componet/trandingtegs";
import axios from "axios";
import Blog from "@/types/Posttypes";
import { POSTS_API_URL as API_URL } from "@/utils/ApiRoutes";
import CommentInput from '@/components/CommentsInput';
import CommentTypes from '@/types/Commentstypes';
import CommentCard from '@/components/CommentsCard';
import fetchComments from '@/utils/getcomments';

const IndexScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const snapPoints = useMemo(() => ["20%", "40%", "80%"], ["20%", "40%", "80%"]);

  // AuthStore
  const { user } = useAuthStore(); // jwt token

  // Comments State
  const [comments, setComments] = useState<CommentTypes[]>([]);

  // Posts State
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch Posts
  const fetchBlogs = useCallback(async (refresh = false) => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_URL}&limit=10&page=${refresh ? 1 : page}`, {
        headers: user?.jwt ? { Authorization: `Bearer ${user.jwt}` } : {},
      });

      const fetchedBlogs = res.data.data.blogs || [];
      const newPage = res.data.data.page;
      const newTotalPages = res.data.data.totalPages;

      if (refresh) {
        setBlogs(fetchedBlogs);
      } else {
        setBlogs((prev) => [...prev, ...fetchedBlogs]);
      }
      setPage(newPage);
      setTotalPages(newTotalPages);
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      setError(err?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
      if (refresh) setRefreshing(false);
    }
  }, [page, user]);

  // Call Fn on Component Mount or when page changes Load
  useEffect(() => {
    fetchBlogs(true);
  }, []);


  // Posts Controlers
  const handleRefresh = () => {
    setRefreshing(true);
    fetchBlogs(true);
  };
  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };


  // BottomSheet Controlers
  const openBottomSheet = (blog: Blog) => {
    setSelectedBlog(blog);
    fetchComments(blog._id, setComments);
    sheetRef.current?.snapToIndex(3);
  };

  // Style Animations
  const streakTranslate = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });
  const streakOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header />

        {
          loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </View>
          ) : (
            <FlatList
              contentContainerStyle={styles.scrollContent}
              data={blogs}
              keyExtractor={(item) => item._id}
              ListHeaderComponent={
                <>
                  <Animated.View
                    style={{
                      transform: [{ translateY: streakTranslate }],
                      opacity: streakOpacity,
                      paddingHorizontal: 16,
                      paddingTop: Platform.OS === "ios" ? 100 : 90,
                    }}
                  >
                    <StreakCard />
                  </Animated.View>

                  <Tegs />

                  <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
                    {blogs.length === 0 && !loading && (
                      <View style={{ marginTop: 20, alignItems: "center" }}>
                        <Text>No posts available</Text>
                      </View>
                    )}
                  </View>
                </>
              }
              renderItem={({ item }) => (
                <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
                  <BlogCard
                    userImage={item.createdBy.profileimg}
                    userName={item?.createdBy.username}
                    userDesignation={item.toptitle}
                    caption={item.content}
                    postImage={item.coverImageURL}
                    likesCount={item.likeCount}
                    commentsCount={item.commentsCount || 0}
                    isLiked={item.likedByCurrentUser}
                    onCommentPress={() => openBottomSheet(item)}
                  />
                </View>
              )}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
            />
          )
        }

        {/* BottomSheet */}
        <BottomSheet
          ref={sheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose
          style={{ zIndex: 999 }}
          backgroundStyle={{ backgroundColor: "#000000" }}
          handleIndicatorStyle={{ backgroundColor: "#444" }}
        >
          {selectedBlog ? (
            <>
              {/* Scrollable Comments */}
              <BottomSheetFlatList
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <CommentCard comment={item} />
                )}
                contentContainerStyle={[styles.commentContainerDark, { marginBottom : 100 }]} // 👈 add padding for input space
              />

              {/* Absolute Positioned Input */}
              <View style={styles.inputContainer}>
                <CommentInput
                  postId={selectedBlog._id}
                  commentOn="Post"
                  setComments={setComments}
                />
              </View>
            </>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </View>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#0F0F0F',
    padding: 8,
  },
  commentContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
  commentItem: {
    padding: 14,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  commentContainerDark: {
    backgroundColor: "#0F0F0F",
    zIndex: 999,
    marginBottom: 80,
  },
  commentItemDark: {
    padding: 14,
    borderBottomColor: "#222",
    borderBottomWidth: 1,
  },
});

export default IndexScreen;