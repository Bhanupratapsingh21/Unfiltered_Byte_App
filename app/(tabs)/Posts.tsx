import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  FlatList,
  RefreshControl,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
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
import fetchComments from '@/lib/fetchComments';

const IndexScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const snapPoints = useMemo(() => ["25%", "80%", "90%"], []);

  const { user } = useAuthStore(); // jwt token

  const [comments, setComments] = useState<CommentTypes[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);
  const [pageComment, setPageComment] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


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

  useEffect(() => {
    fetchBlogs(true);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBlogs(true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleSheetChange = useCallback((index: number) => {
    console.log("handleSheetChange", index);
  }, []);

  const openBottomSheet = useCallback((blog: Blog, index: number) => {
    setSelectedBlog(blog);
    sheetRef.current?.snapToIndex(index); // open at 90%
    setPageComment(1);
    setCommentLoading(true);
    setCommentError(null);
    setComments([]);
    setTimeout(() => {
      fetchComments(blog._id, 1, setComments, setCommentLoading, setCommentError, user);
    }, 0);
  }, []);

  const handleLoadMoreComments = () => {
    if (pageComment < totalCommentPages && !commentLoading && selectedBlog) {
      const nextPage = pageComment + 1;
      setPageComment(nextPage);

      fetchComments(
        selectedBlog._id,
        nextPage,
        setComments,
        setCommentLoading,
        setCommentError,
        user,
        comments
      );
    }
  };

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
                    postId={item._id}
                    userImage={item.createdBy.profileimg}
                    userName={item?.createdBy.username}
                    userDesignation={item.toptitle}
                    caption={item.content}
                    postImage={item.coverImageURL}
                    likesCount={item.likeCount}
                    commentsCount={item.commentCount || 0}
                    isLiked={item.likedByCurrentUser || false}
                    onCommentPress={() => { openBottomSheet(item, 2) }}
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
              keyboardShouldPersistTaps="handled"
            />
          )
        }

        {/* Transparent Overlay for Outside Tap Close 
        {isSheetOpen && (
          <TouchableWithoutFeedback onPress={() => sheetRef.current?.close()}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
        )}
          */}

        {/* BottomSheet */}
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose
          style={{ zIndex: 999 }} // 
          onChange={handleSheetChange}
          backgroundStyle={{ backgroundColor: "#000000" }}
          handleIndicatorStyle={{ backgroundColor: "#444" }}
        >
          <>
            <View style={{ padding: 16, paddingBottom: 5 }}>
              <Text style={{ fontSize: 18, textAlign: "center", color: "#fff", fontWeight: "bold" }}>
                Swipe Up To Comment ↑
              </Text>
            </View>

            {!commentLoading ? (

              <>

                <BottomSheetFlatList
                  data={comments}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => <CommentCard comment={item} />}
                  contentContainerStyle={[styles.commentContainerDark, { marginBottom: 100 }]}
                  onEndReached={handleLoadMoreComments}
                  onEndReachedThreshold={0.5}
                />

                {commentError && (
                  <View style={{ marginBottom: 50, padding: 20, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 16, color: "red", textAlign: 'center' }}>
                      {commentError}
                    </Text>
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <CommentInput
                    postId={selectedBlog?._id}
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

          </>

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
    bottom: 65,
    width: '100%',
    backgroundColor: '#0F0F0F',
    padding: 8,
  },
  commentContainerDark: {
    backgroundColor: "#0F0F0F",
    zIndex: 999,
    marginBottom: 80,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 10,
  },
});

export default IndexScreen;
