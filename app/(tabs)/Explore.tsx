
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useMemo, useRef, useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import NotificationIcon from "@/assets/icons/Bellicon";
import { useAuthStore } from "@/store/authStore";
import StreakCard from "@/components/Home/StreakCard";
import BlogCard from "@/components/PostCard";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import Posts from "@/components/Services Componet/Posts";
import Header from "@/components/Header";
import Spinner from "@/components/LoadingCircle";
import Tegs from "@/components/Services Componet/trandingtegs";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL + "tweets/getblogsadv?q=newestfirst";

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
  commentsCount: number;
  likeCount: number;
  likedByCurrentUser: boolean;
  subscribedByCurrentUser: boolean;
};

const IndexScreen = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const data = useMemo(() =>
    Array(30)
      .fill(0)
      .map((_, index) => `Comment ${index}`),
    []);

  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const handleSnapPress = (index: number) => {
    sheetRef.current?.snapToIndex(index);
  };

  const handleClosePress = () => {
    sheetRef.current?.close();
  };

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <View style={styles.itemContainer}>
        <Text style={{ color: 'black' }}>{item}</Text>
      </View>
    ),
    []
  );

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { user } = useAuthStore(); // Assuming jwt token stored

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
        <FlatList
          contentContainerStyle={styles.scrollContent}
          data={blogs}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={
            <>
              {/* Animated StreakCard */}
              <Animated.View
                style={{
                  transform: [{ translateY: streakTranslate }],
                  opacity: streakOpacity,
                  paddingHorizontal: 16,
                  paddingTop: Platform.OS === "ios" ? 100 : 90,
                  paddingBottom: 0,
                }}
              >
                <StreakCard />
              </Animated.View>

              {/* Trending Tags */}
              <Tegs />

              {/* Empty State */}
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
                onCommentPress={() => handleSnapPress(0)}
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
        {/* BottomSheet */}
        <BottomSheet
          ref={sheetRef}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose
          style={{ zIndex: 999 }} // 👈 helps lift above tabs
        >
          <BottomSheetFlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={renderItem}
            contentContainerStyle={styles.contentContainer}

          />
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
  topContainer: {
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  buttonGroup: {
    marginTop: 30,
    gap: 10,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  contentContainer: {
    backgroundColor: "white",
    paddingBottom: 20,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
});

export default IndexScreen;
