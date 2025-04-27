import React, { useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform,
    FlatList,
} from "react-native";

const TAGS = ["#SRHvsMI", "#Pakistan", "#RohitSharma", "#MI", "#Umpire", "#SAARC"];

export default function Tegs() {

    return (
        <>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending In India</Text>
            </View>
            <FlatList
                data={TAGS}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagContainer}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item}</Text>
                    </View>
                )}
            />
        </>
    );
}

const styles = StyleSheet.create({
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
    sectionHeader: {
        paddingHorizontal: 16,
        paddingBottom: 8,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },

});
