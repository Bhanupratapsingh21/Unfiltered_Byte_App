import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { GETTEGS_URL } from "@/utils/ApiRoutes";

const DEFAULT_TAGS = ["SRHvsMI", "Pakistan", "RohitSharma", "MI", "Umpire", "SAARC"];

export default function Tags() {
    const [tags, setTags] = useState<string[]>(DEFAULT_TAGS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTags = async () => {
        setIsLoading(true);
        setRefreshing(true);
        setError(null);

        try {
            const response = await axios.get<{ data: string[] }>(GETTEGS_URL);
            setTags(response.data.data || DEFAULT_TAGS);
        } catch (error: unknown) {
            console.error("Error fetching tags:", error);

            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || error.message);
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unexpected error occurred");
            }

            // Fallback to default tags if API fails
            setTags(DEFAULT_TAGS);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    const handleRefresh = () => {
        fetchTags();
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending in India</Text>
            </View>

            {isLoading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#ffffff" />
                </View>
            ) : (
                <FlatList
                    data={tags}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagContainer}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    renderItem={({ item }) => (
                        <View style={styles.tag}>
                            <Text style={styles.tagText}>#{item}</Text>
                        </View>
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor="#ffffff"
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
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
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    tagText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
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
    errorText: {
        color: "#ff4444",
        fontSize: 12,
        marginTop: 4,
    },
    loadingContainer: {
        height: 60,
        justifyContent: "center",
        alignItems: "center",
    },
});