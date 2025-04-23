import React from "react";
import { View, Pressable, Text, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Dimensions } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import Card from "@/components/Infotab/AngerCard";
import Humanicon from "@/assets/icons/humanicon";
import { NormalIcon, HappyIcon, AngerIcon, SadIcon } from '@/assets/icons/emotionemojis';
import CardData from "@/types/Carddata.types";

const cardsData: CardData[] = [
    {
        id: '906',
        icon: <HappyIcon height={32} />,
        bgColor: "#1F1F1F",
        type: "Calm",
        iconBgColor: "#FFB700",
        issueText: "Want More Joy?",
        description: "Build joy through gratitude and purpose.",
    },
    {
        id: '901',
        icon: <AngerIcon height={32} />,
        bgColor: "#1F1F1F",
        type: "Anger",
        iconBgColor: "#FF4A4A",
        issueText: "Feeling Angry?",
        description: "Learn how to use anger constructively.",
    },
    {
        id: '903',
        icon: <NormalIcon height={32} />,
        bgColor: "#1F1F1F",
        type: "Blame",
        iconBgColor: "#FF7F50",
        issueText: "Caught in Blame?",
        description: "Shift blame into personal power.",
    },
    {
        id: '904',
        icon: <SadIcon height={32} />,
        bgColor: "#1F1F1F",
        type: "Sorrow",
        iconBgColor: "#6789FF",
        issueText: "Feeling Low?",
        description: "Explore how sorrow leads to healing.",
    },
    {
        id: '905',
        icon: <Humanicon height={32} />,
        bgColor: "#1F1F1F",
        type: "Confusion",
        iconBgColor: "#00C6AE",
        issueText: "Mentally Foggy?",
        description: "Turn confusion into clarity.",
    },
    {
        id: '906',
        icon: <HappyIcon height={32} />,
        bgColor: "#1F1F1F",
        type: "Happiness",
        iconBgColor: "#FFB700",
        issueText: "Want More Happiness?",
        description: "Build happiness through gratitude and purpose.",
    }
];

export default function Indexscreen() {
    const chunkArray = (array: CardData[], chunkSize: number) => {
        const result = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };

    const cardRows = chunkArray(cardsData, 2);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, backgroundColor: "#0F0F0F" }}
        >
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <AntDesign name="arrowleft" size={24} color="#FFFFFF" />
                </Pressable>
                <Text style={styles.title}>Information</Text>
                <View style={styles.backButton2} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Circle / Brain */}
                <View style={styles.circleContainer}>
                    <View style={styles.circleOuter}>
                        <View style={styles.circleMiddle} />
                        <View style={styles.circleInner} />
                        <View style={styles.imageContainer}>
                            <Image
                                source={require("@/assets/images/brain.png")}
                                style={styles.brainImage}
                            />
                        </View>
                    </View>
                </View>

                {/* Cards Grid */}
                <View style={styles.cardsGrid}>
                    {cardRows.map((row, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={styles.cardRow}>
                            {row.map(card => (
                                <Card
                                    type={card.type}
                                    key={card.id}
                                    icon={card.icon}
                                    bgColor={card.bgColor}
                                    iconBgColor={card.iconBgColor}
                                    issueText={card.issueText}
                                    description={card.description}
                                />
                            ))}
                            {row.length < 2 && <View style={styles.emptyCard} />}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - (CARD_MARGIN * 3)) / 2;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 20,
        paddingBottom: 10,
        backgroundColor: '#0F0F0F',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        flex: 1,
        textAlign: 'center',
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
        width: 40,
        height: 40,
    },
    scrollContainer: {
        paddingTop: 20,
        paddingBottom: 70,
        paddingHorizontal: CARD_MARGIN,
    },
    circleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    circleOuter: {
        position: 'relative',
        width: 240,
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleMiddle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#292929',
    },
    circleInner: {
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: '#444',
    },
    imageContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 1,
        borderColor: '#555',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1F1F1F',
    },
    brainImage: {
        width: '90%',
        height: '90%',
        resizeMode: 'contain',
    },
    cardsGrid: {
        flexDirection: 'column',
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: CARD_MARGIN,
    },
    emptyCard: {
        width: CARD_WIDTH,
    },
});
