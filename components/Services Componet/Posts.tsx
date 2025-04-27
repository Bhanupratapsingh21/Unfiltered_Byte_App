import React, { useEffect, useState, useCallback } from "react";
import { View, ActivityIndicator, FlatList, RefreshControl, Text } from "react-native";
import axios from "axios";
import { useAuthStore } from "@/store/authStore"; // Assuming you have auth store
import BlogCard from "../PostCard";
import Spinner from "../LoadingCircle";

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

export default function Posts() {
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
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 150 }}>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
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
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={!loading ? (
          <View style={{ marginTop: 20, alignItems: 'center' }}>
            <Text>No posts available</Text>
          </View>
        ) : null}
      />
    </View>
  );
}
