import React, { useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  Platform,
  TouchableOpacity,
  FlatList,
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
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";
import axios from "axios";
import Spinner from "@/components/LoadingCircle";
import Tegs from "@/components/Services Componet/trandingtegs";

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
}


const TAGS = ["#SRHvsMI", "#Pakistan", "#RohitSharma", "#MI", "#Umpire", "#SAARC"];

export default function IndexScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

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
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const { user } = useAuthStore(); // Assuming user.jwtToken or user.token etc.

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
        setBlogs(prev => [...prev, ...fetchedBlogs]);
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
    fetchBlogs(true); // Initial load
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBlogs(true);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !loading) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchBlogs();
    }
  }, [page]);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="flex justify-center items-center gap-2  p-14">
        <Spinner />
      </View>
    );
  };

  if (error) {
    return (
      <View style={{ padding: 16, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "red" }}>{error}</Text>
        <TouchableOpacity onPress={handleRefresh} style={{ marginTop: 10 }}>
          <Text style={{ color: "#FFB700" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
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
                paddingHorizontal: 16, // StreakCard can have its own padding
                paddingTop: Platform.OS === "ios" ? 100 : 90,
                paddingBottom: 0,
              }}
            >
              <StreakCard />
            </Animated.View>

            {/* Trending Tags */}
            <Tegs />

            {/* Now before Blogs start, wrap in a View with padding */}
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              {blogs.length === 0 && !loading && (
                <View style={{ marginTop: 20, alignItems: 'center' }}>
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
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  header: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: "blur",
    paddingHorizontal: 16,
    marginHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  menuButton: {
    padding: 10,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  tagContainer: {
    paddingHorizontal: 16,
    paddingBottom: 15,
    gap: 8,
    height: 60,
    alignItems: "center",
  },
  tag: {
    borderColor: "#fff",
    borderWidth: 0.4,
    borderRadius: 20,
    height: 30,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    color: "#fff",
    fontSize: 13,
  },
});
