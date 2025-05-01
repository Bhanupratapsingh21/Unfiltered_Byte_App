import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import { useAuthStore } from "@/store/authStore";
import Svg, { Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import activitiesData from "@/Data/activity";
const { width } = Dimensions.get('window');
const CARD_WIDTH = 330;
const CARD_HEIGHT = 184;

export default function StreakCard() {
    const userprofile = useAuthStore(state => state.userProfile);
    const [Activity , setActivity] = useState<String>("");
    const user = useAuthStore(state => state.user);
    const streaks = useAuthStore(state => state.Streak);

    const streak = streaks?.streak || 1;
    const streakText = streak > 1 ? `${streak} days` : `${streak} day`;
    
    useEffect(()=>{
        const today = new Date();
        const day = today.getDate();
        const firstDigit = Math.floor(day / 10) || 1; // Get the first digit or default to 1
        activitiesData[firstDigit].exerciseName
        
        const activity = activitiesData[firstDigit]?.exerciseName || "an activity";
        setActivity(`${activity}. Check it out in the Activities Section!`);
    },[])
    return (

        <View style={styles.card}>
            <Svg
                width={CARD_WIDTH}
                height={175}
                viewBox="0 0 342 175"
                style={styles.background}>
                <Defs>
                    <LinearGradient id="bgGradient" x1="0" y1="128" x2="354.142" y2="128" gradientUnits="userSpaceOnUse">
                        <Stop offset="0" stopColor="#5936B4" />
                        <Stop offset="1" stopColor="#362A84" />
                    </LinearGradient>
                </Defs>
                <Path
                    fill="url(#bgGradient)"
                    d="M0 66.4396C0 31.6455 0 14.2484 11.326 5.24044C22.6519 -3.76754 39.6026 0.147978 73.5041 7.97901L307.903 62.1238C324.259 65.9018 332.436 67.7909 337.218 73.8031C342 79.8154 342 88.2086 342 104.995V131C342 151.742 342 162.113 335.556 168.556C329.113 175 318.742 175 298 175H44C23.2582 175 12.8873 175 6.44365 168.556C0 162.113 0 151.742 0 131V66.4396Z"
                />
            </Svg>

            {/* Fire icon */}
            <View style={styles.cloud}>
                <Text style={styles.cloudEmoji}>🔥</Text>
            </View>

            {/* Greeting & Streak Info */}
            <View style={{ gap: 3, marginTop: 12 }}>
                <Text style={styles.greetingText}>Hi, {userprofile?.username || 'Dev'} 👋</Text>
                <Text style={styles.mainText}>Streak : {streakText}</Text>
            </View>

            {/* Activity Info */}
            <View style={styles.info}>
                <View>
                    <Text style={styles.textGray}>Today’s Activity</Text>
                    <Text style={styles.activityText}>{Activity}</Text>
                </View>
            </View>
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
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        padding: 20,
        position: 'relative',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    cloud: {
        position: 'absolute',
        top: 25,
        right: 4,
    },
    cloudEmoji: {
        fontSize: 60,
    },
    info: {
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textGray: {
        color: 'rgba(235, 235, 245, 0.60)',
    },
    location: {
        color: '#FFF',
    },
    weatherType: {
        color: '#FFF',
        alignSelf: 'flex-end',
    },
    greetingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
    },
    mainText: {
        fontSize: 30,
        fontWeight: '700',
        color: '#FFF',
    },
    activityText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
    },
    motivation: {
        color: '#FFB700',
        fontSize: 14,
        fontWeight: '700',
    },

});

