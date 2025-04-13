import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions, TextInput, ActivityIndicator, RefreshControl } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import ActivityCard from "@/components/Home/ActivityCard";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";
import { Feather } from "@expo/vector-icons";

export default function Indexscreen() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const limit = 10; // Number of items per page

  // Fetch activities with pagination
  const fetchActivities = useCallback(async (pageNum: number, isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const newActivities = await ActivityService.getActivities({
        limit,
        offset: (pageNum - 1) * limit,
        filters: searchQuery ? {
          // Add search filters here based on your requirements
          // For example, search by title or tags
          type: searchQuery,
        } : {},
        sortField: "title",
        sortOrder: "asc",
      });

      if (newActivities.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setActivities(newActivities);
        } else {
          setActivities(prev => [...prev, ...newActivities]);
        }
      }
    } catch (err) {
      setError("Failed to fetch trainings. Please try again.");
      console.error("Error fetching trainings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  // Initial load
  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchActivities(1, true);
  }, [fetchActivities]);

  // Handle infinite scroll
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchActivities(page + 1);
    }
  };

  // Handle search
  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    fetchActivities(1);
  };

  if (error && activities.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable onPress={() => fetchActivities(1)} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#0F0F0F" }}
    >
      {/* Sticky Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
        <Text style={[styles.title, { textAlign: 'center' }]}>Trainings</Text>
        <View style={styles.backButton2} />
      </View>


      {/* ✅ Search Bar (Pressable, no input here) */}
      <Pressable style={styles.searchBarContainer}>
        <Feather name="search" size={20} color="#B0B0B0" style={{ marginRight: 10 }} />
        <Text style={styles.searchPlaceholder}>Search...</Text>
      </Pressable>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FFB700"]}
            tintColor="#04714A"
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent) && !loading && hasMore) {
            handleLoadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {activities.map(activity => (
          <ActivityCard
            key={activity.$id}
            id={activity.$id}
            {...activity}
          />
        ))}

        {loading && activities.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#FFB700" />
          </View>
        )}

        {!hasMore && (
          <View style={styles.endOfListContainer}>
            <Text style={styles.endOfListText}>No more trainings to show</Text>
          </View>
        )}
      </ScrollView>

      {/* Full screen loading indicator */}
      {loading && activities.length === 0 && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#04714A" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

// Helper function to check if scroll is near bottom
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
    borderRadius: 30,
    padding: 5,
    borderColor: "#292929",
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1F1F1F',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#292929',
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    paddingHorizontal: 12,
    fontWeight: "800",
    paddingVertical: 14,
    borderRadius: 20,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#0F0F0F',
  },
  sendButton: {
    backgroundColor: "#FFB700",
    borderRadius: 30,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    zIndex: 1,
    backgroundColor: '#0F0F0F',
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 20,
    flex: 1,
    fontWeight: '800',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  backButton: {
    backgroundColor: '#292929',
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton2: {
    padding: 8,
    borderRadius: 8,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    paddingTop: 4,
    paddingBottom: 70,
    paddingHorizontal: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#0F0F0F",
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFB700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endOfListContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endOfListText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  fullScreenLoading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  searchPlaceholder: {
    color: '#B0B0B0',
    fontSize: 16,
  },
});
