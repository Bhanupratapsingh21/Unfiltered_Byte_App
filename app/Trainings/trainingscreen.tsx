import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    Animated,
    ScrollView,
    ActivityIndicator,
    Alert,
    Vibration
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import activitiesData from '@/Data/activity';

const { width, height } = Dimensions.get('window');

type ActivityType = {
    id: string;
    title: string;
    description: string;
    duration?: string;
    time?: string;
    image?: string;
    steps?: string[];
    totalSteps?: number;
    currentStep?: number;
    exerciseName?: string;
    name?: string;
    difficulty?: string;
    activitytype?: string;
};

export default function ActivityDetailScreen() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [activity, setActivity] = useState<ActivityType | null>(null);
    const { id } = useLocalSearchParams();
    const [currentStep, setCurrentStep] = useState(1);
    const [completed, setCompleted] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Timer states
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [timerDuration, setTimerDuration] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Parse duration from activity (e.g., "25 min" → 1500 seconds)
    const parseDuration = (duration: string | undefined) => {
        if (!duration) return 0;
        const match = duration.match(/(\d+)\s*min/);
        return match ? parseInt(match[1]) * 60 : 0;
    };

    useEffect(() => {
        const fetchActivity = () => {
            try {
                setLoading(true);
                const foundActivity = activitiesData.find(item => item.id === id);
                
                if (!foundActivity) throw new Error('Activity not found');

                setActivity(foundActivity);
                setCurrentStep(foundActivity.currentStep || 1);
                setImages(foundActivity.image ? [foundActivity.image] : [
                    require('@/assets/images/image.png'),
                    require('@/assets/images/brain.png')
                ]);

                // Initialize timer
                const durationInSeconds = parseDuration(foundActivity.duration || foundActivity.time);
                setTimerDuration(durationInSeconds);
                setTimeRemaining(durationInSeconds);
            } catch (err) {
                console.error('Error:', err);
                Alert.alert('Error', 'Failed to load activity');
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [id]);

    // Timer control functions
    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        
        setIsTimerRunning(true);
        timerRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setIsTimerRunning(false);
                    Vibration.vibrate([500, 500, 500]); // Vibrate pattern when timer ends
                    Alert.alert('Time Up!', 'Timer has completed', [
                        { text: 'OK', onPress: () => handleNextStep() }
                    ]);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const pauseTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTimerRunning(false);
    };

    const resetTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setTimeRemaining(timerDuration);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNextStep = () => {
        if (!activity) return;

        if (currentStep < (activity.totalSteps || 1)) {
            setCurrentStep(prev => prev + 1);
            resetTimer(); // Reset timer when moving to next step
        } else {
            setCompleted(true);
            pauseTimer();
            Alert.alert(
                'Completed!',
                'You have successfully completed this activity',
                [
                    { text: 'OK', onPress: () => router.back() }
                ]
            );
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            setCompleted(false);
            resetTimer(); // Reset timer when going back
        }
    };

    const renderDotIndicators = () => {
        return (
            <View style={styles.dotContainer}>
                {images.map((_, i) => {
                    const opacity = scrollX.interpolate({
                        inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                        outputRange: [0.3, 1, 0.3],
                        extrapolate: 'clamp'
                    });
                    return (
                        <Animated.View
                            key={`dot-${i}`}
                            style={[styles.dot, { opacity }]}
                        />
                    );
                })}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <ActivityIndicator size="large" color="#FFB700" />
            </View>
        );
    }

    if (!activity) {
        return (
            <View style={[styles.container, styles.errorContainer]}>
                <Text style={styles.errorText}>Activity not found</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                    <Feather name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>

            {/* Image Slider */}
            <View style={styles.sliderContainer}>
                <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                >
                    {images.map((image, index) => (
                        <View key={index} style={styles.slide}>
                            {typeof image === 'string' ? (
                                <Image source={{ uri: image }} style={styles.slideImage} />
                            ) : (
                                <Image source={image} style={styles.slideImage} />
                            )}
                        </View>
                    ))}
                </ScrollView>
                {renderDotIndicators()}

                {/* Fixed Text Overlay */}
                <View style={styles.textOverlay}>
                    <Text style={styles.name}>{activity.title}</Text>
                    <Text style={styles.description}>{activity.description}</Text>
                </View>
            </View>

            {/* Bottom Panel */}
            <View style={styles.bottomScreen}>
                <View style={styles.panelHandle}>
                    <View style={styles.handleBar} />
                </View>

                <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
                    {/* Timer Display - Only show if activity has duration */}
                    {timerDuration > 0 && (
                        <View style={styles.timerContainer}>
                            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                            <View style={styles.timerControls}>
                                {!isTimerRunning ? (
                                    <TouchableOpacity 
                                        style={styles.timerButton} 
                                        onPress={startTimer}
                                    >
                                        <Ionicons name="play" size={24} color="#FFB700" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity 
                                        style={styles.timerButton} 
                                        onPress={pauseTimer}
                                    >
                                        <Ionicons name="pause" size={24} color="#FFB700" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity 
                                    style={styles.timerButton} 
                                    onPress={resetTimer}
                                >
                                    <Ionicons name="refresh" size={24} color="#FFB700" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* Progress Indicator */}
                    <View style={styles.topbox}>
                        <Text style={styles.sectionTitle}>Steps</Text>
                        <Text style={styles.sectionTitle}>{currentStep}/{activity.totalSteps || 0}</Text>
                    </View>

                    {/* Current Step Content */}
                    <View style={styles.exerciseHeader}>
                        <Image 
                            source={activity.image ? { uri: activity.image } : require('@/assets/images/brain.png')} 
                            style={styles.exerciseImage} 
                        />
                        <View style={styles.exerciseTextContainer}>
                            <Text style={styles.exerciseName}>
                                {activity.exerciseName || activity.name}
                            </Text>
                            <View style={styles.exerciseMeta}>
                                {activity.time && (
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={16} color="#FFB700" />
                                        <Text style={styles.metaText}>{activity.time}</Text>
                                    </View>
                                )}
                                {activity.difficulty && (
                                    <View style={styles.metaItem}>
                                        <Ionicons name="speedometer-outline" size={16} color="#FFB700" />
                                        <Text style={styles.metaText}>{activity.difficulty}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>

                    {/* Current Step Description */}
                    <Text style={styles.descriptionText}>
                        {activity.steps && activity.steps[currentStep - 1]}
                    </Text>

                    {/* Full Steps List */}
                    <View style={styles.stepsSection}>
                        <Text style={styles.stepsTitle}>All Steps</Text>
                        <View style={styles.stepsContainer}>
                            {activity.steps?.map((step, index) => (
                                <View key={index} style={[
                                    styles.stepItem,
                                    index + 1 === currentStep && styles.activeStep
                                ]}>
                                    <View style={[
                                        styles.stepNumber,
                                        index + 1 <= currentStep && styles.completedStep
                                    ]}>
                                        <Text style={styles.stepNumberText}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Navigation Buttons */}
                <View style={styles.buttonWrapper}>
                    <View style={styles.buttonRow}>
                        {currentStep > 1 && (
                            <TouchableOpacity 
                                style={[styles.navButton, styles.secondaryButton]}
                                onPress={handlePreviousStep}
                            >
                                <Text style={styles.secondaryButtonText}>Previous</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={[
                                styles.navButton, 
                                styles.primaryButton,
                                completed && styles.completedButton
                            ]}
                            onPress={handleNextStep}
                        >
                            <Text style={styles.primaryButtonText}>
                                {completed ? 'Completed!' : 
                                 currentStep === (activity.totalSteps || 0) ? 'Finish' : 'Next Step'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    buttonContainer: {
        position: 'absolute',
        top: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        zIndex: 1,
    },
    backButton: {
        backgroundColor: 'rgba(41, 41, 41, 0.7)',
        padding: 10,
        borderRadius: 15,
    },
    shareButton: {
        backgroundColor: 'rgba(41, 41, 41, 0.7)',
        padding: 10,
        borderRadius: 15,
    },
    topbox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderContainer: {
        height: height * 0.5,
        justifyContent: 'center',
    },
    slide: {
        width,
        height: height * 0.5,
    },
    slideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    name: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        color: '#E0E0E0',
        fontSize: 14,
    },
    dotContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        backgroundColor: '#FFB700',
        marginHorizontal: 4,
        borderRadius: 4,
    },
    bottomScreen: {
        flex: 1,
        backgroundColor: '#1F1F1F',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20,
        paddingTop: 15,
        paddingHorizontal: 20,
    },
    panelHandle: {
        alignItems: 'center',
        marginBottom: 10,
    },
    handleBar: {
        width: 90,
        height: 5,
        backgroundColor: '#FFB700',
        borderRadius: 3,
    },
    contentContainer: {
        flex: 1,
        paddingBottom: 80,
    },
    timerContainer: {
        backgroundColor: '#292929',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FFB700',
        marginBottom: 10,
    },
    timerControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    timerButton: {
        backgroundColor: '#1F1F1F',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    exerciseHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    exerciseImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginRight: 15,
    },
    exerciseTextContainer: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    exerciseMeta: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    metaText: {
        marginLeft: 5,
        color: '#B0B0B0',
        fontSize: 14,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#E0E0E0',
        marginBottom: 25,
        backgroundColor: '#292929',
        padding: 15,
        borderRadius: 12,
    },
    stepsSection: {
        marginBottom: 20,
    },
    stepsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 15,
    },
    stepsContainer: {
        marginBottom: 20,
    },
    stepItem: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'flex-start',
        padding: 12,
        borderRadius: 8,
    },
    activeStep: {
        backgroundColor: 'rgba(255, 183, 0, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#FFB700',
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#292929',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    completedStep: {
        backgroundColor: '#FFB700',
    },
    stepNumberText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    stepText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 22,
        color: '#B0B0B0',
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#FFB700',
        marginLeft: 10,
    },
    secondaryButton: {
        backgroundColor: '#292929',
        marginRight: 10,
    },
    completedButton: {
        backgroundColor: '#4CAF50',
    },
    primaryButtonText: {
        color: '#0F0F0F',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        color: '#0F0F0F',
        fontWeight: 'bold',
    },
});