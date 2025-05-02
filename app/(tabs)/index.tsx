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
import Header from "@/components/Header";
import Spinner from "@/components/LoadingCircle";
import Tegs from "@/components/Services Componet/trandingtegs";
import Blog from "@/types/Posttypes";
import activitiesData from '@/Data/activity';
import { ActivityType } from '@/types/activitycard.types';
import ActivityCard from '@/components/Home/ActivityCard';
import Categories from '@/components/Home/Categories';
const IndexScreen = () => {

  const scrollY = useRef(new Animated.Value(0)).current;

  const { user } = useAuthStore(); // jwt token
  const [blogs, setBlogs] = useState(activitiesData);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);

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
              keyExtractor={(item) => item.id.toString()}
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
                  <Animated.View
                    style={{
                      transform: [{ translateY: streakTranslate }],
                      opacity: streakOpacity,
                      paddingHorizontal: 0,
                      paddingTop: Platform.OS === "ios" ? 10 : 5,
                    }}
                  >

                    <Categories />
                  </Animated.View>

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
                  <ActivityCard {...item} />
                </View>
              )}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
