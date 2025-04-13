import React, { useState, useEffect, useCallback } from "react";
import { View, Pressable, Text, Image, ScrollView, StyleSheet, Dimensions, ActivityIndicator, RefreshControl, Platform } from "react-native";
import { useRouter } from "expo-router";
import Categories from '@/components/Home/Categories';
import { Feather } from "@expo/vector-icons";
import NotificationIcon from "@/assets/icons/Bellicon";
import ActivityCard from "@/components/Home/ActivityCard";
import { useAuthStore } from "@/store/authStore";
import ActivityService from "@/lib/activity";
import { ActivityType } from "@/types/activitycard.types";

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;

export default function Indexscreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;

  const fetchActivities = useCallback(async (pageNum: number, isRefreshing = false) => {
    try {
      if (!isRefreshing) setLoading(true);
      setError(null);

      const newActivities = await ActivityService.getActivities({
        limit,
        offset: (pageNum - 1) * limit,
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
      setError("Failed to fetch activities. Please try again.");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(1);
  }, [fetchActivities]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    fetchActivities(1, true);
  }, [fetchActivities]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      fetchActivities(page + 1);
    }
  };

  const handleNavigateToSearch = () => {
    router.push("/"); // replace with your search screen route
  };

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
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
    <View style={{ flex: 1, backgroundColor: "#0F0F0F" }}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Image source={require('@/assets/images/logomainwithouttegline.png')} style={styles.logo} />
        <Pressable style={styles.menuButton}>
          <NotificationIcon />
        </Pressable>
      </View>

      {/* ✅ Search Bar (Pressable, no input here) */}
      <Pressable style={styles.searchBarContainer} onPress={handleNavigateToSearch}>
        <Feather name="search" size={20} color="#B0B0B0" style={{ marginRight: 10 }} />
        <Text style={styles.searchPlaceholder}>Search...</Text>
      </Pressable>

      {/* ✅ Categories Section */}
      <Categories />

      {/* ✅ Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trainings</Text>
        <Pressable onPress={() => router.push("/Trainings")}>
          <Text style={styles.seeAllLink}>See All</Text>
        </Pressable>
      </View>

      {/* ✅ Activity Scroll List */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FFB700"]}
            tintColor="#FFB700"
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
            id={activity.$id}
            redirect={`Trainings/${activity.redirect}?id=${activity.$id}`}
            key={activity.$id}
            title={activity.title}
            description={activity.description}
            tags={activity.tags}
            duration={activity.duration}
            image={activity.image}
            colors={activity.colors}
          />
        ))}

        {loading && activities.length > 0 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#FFB700" />
          </View>
        )}

        {!hasMore && (
          <View style={styles.endOfListContainer}>
            <Text style={styles.endOfListText}>No more activities to show</Text>
          </View>
        )}
      </ScrollView>

      {/* ✅ Full screen loading indicator */}
      {loading && activities.length === 0 && (
        <View style={styles.fullScreenLoading}>
          <ActivityIndicator size="large" color="#FFB700" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: Platform.OS === 'ios' ? 50 : 5,
    paddingBottom: 0,
    backgroundColor: '#0F0F0F',
  },
  logo: {
    width: 100,
    height: 50,
  },
  menuButton: {
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchPlaceholder: {
    color: '#B0B0B0',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 20,
    color: '#FFFFFF',
  },
  seeAllLink: {
    color: '#FFB700',
    fontWeight: '800',
    fontSize: 15,
  },
  scrollContainer: {
    paddingTop: 4,
    paddingBottom: 70,
    paddingHorizontal: CARD_MARGIN,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1F1F1F',
  },
  errorText: {
    color: 'red',
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
});
