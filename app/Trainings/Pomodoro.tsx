import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Platform,
    Vibration,
    Dimensions,
    Appearance,
    Animated,
    Easing
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { router } from 'expo-router';

// Configure notifications
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

type TimerMode = 'work' | 'break' | 'longBreak';
type ThemeMode = 'light' | 'dark';


const PomodoroTimer = () => {
    // Theme state
    // Theme state
    const [theme, setTheme] = useState<ThemeMode>(Appearance.getColorScheme() || 'light');

    // Timer states
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [longBreakTime, setLongBreakTime] = useState(15);
    const [longBreakInterval, setLongBreakInterval] = useState(4);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(workTime * 60);
    const [mode, setMode] = useState<TimerMode>('work');
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [isSoundEnabled, setIsSoundEnabled] = useState(true);
    const [isHapticFeedbackEnabled, setIsHapticFeedbackEnabled] = useState(true);
    const [autoStartNextTimer, setAutoStartNextTimer] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [notificationToken, setNotificationToken] = useState<string | null>(null);
    const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);
    const [notificationResponse, setNotificationResponse] = useState<Notifications.NotificationResponse | null>(null);
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    // Sound
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [selectedSound, setSelectedSound] = useState('default');
    const [volume, setVolume] = useState(0.8);

    // Animation
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Refs
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Register for push notifications
    async function registerForPushNotificationsAsync() {
        if (!Device.isDevice) {
            alert('Must use physical device for Push Notifications');
            return;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            setAreNotificationsEnabled(false);
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setNotificationToken(token);

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    }

    // Schedule notification
    async function scheduleNotification(title: string, body: string) {
        if (!areNotificationsEnabled) return;

        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: null, // Send immediately
        });
    }

    // Cancel all notifications
    async function cancelAllNotifications() {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    // Load sound
    async function loadSound(soundName: string) {
        let soundFile;
        switch (soundName) {
            case 'digital':
                soundFile = require('@/assets/audios/digital.mp3');
                break;
            case 'bell':
                soundFile = require('@/assets/audios/digital.mp3');
                break;
            case 'chime':
                soundFile = require('@/assets/audios/digital.mp3');
                break;
            default:
                soundFile = require('@/assets/audios/digital.mp3');
        }

        const { sound } = await Audio.Sound.createAsync(soundFile);
        await sound.setVolumeAsync(volume);
        setSound(sound);
    }

    // When timer completes
    const timerComplete = async () => {
        playSound();
        vibrate();
        triggerConfettiAnimation();

        let notificationTitle = '';
        let notificationBody = '';

        if (mode === 'work') {
            const newSessionsCompleted = sessionsCompleted + 1;
            setSessionsCompleted(newSessionsCompleted);

            if (newSessionsCompleted % longBreakInterval === 0) {
                notificationTitle = 'Time for a long break!';
                notificationBody = `Great job! Take a ${longBreakTime} minute break.`;
                setMode('longBreak');
                setTimeLeft(longBreakTime * 60);
            } else {
                notificationTitle = 'Time for a short break!';
                notificationBody = `Good work! Take a ${breakTime} minute break.`;
                setMode('break');
                setTimeLeft(breakTime * 60);
            }
        } else {
            notificationTitle = 'Break time over!';
            notificationBody = 'Ready to focus again?';
            setMode('work');
            setTimeLeft(workTime * 60);
        }

        if (areNotificationsEnabled) {
            await scheduleNotification(notificationTitle, notificationBody);
        }

        if (autoStartNextTimer) {
            startTimer();
        }
    };

    // Initialize notifications
    useEffect(() => {
        registerForPushNotificationsAsync();

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notification response received:', response);
            setNotificationResponse(response);
        });

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current);
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current);
            }
            cancelAllNotifications();
        };
    }, []);


    // Available alarm sounds
    const alarmSounds = [
        { id: 'default', name: 'Classic Alarm', icon: 'clock' },
        { id: 'digital', name: 'Digital Beep', icon: 'bell' },
        { id: 'bell', name: 'School Bell', icon: 'bell' },
        { id: 'chime', name: 'Soft Chime', icon: 'music' },
    ];

    // Colors based on theme
    const colors = {
        light: {
            primary: '#FFB700',
            background: '#FFFFFF',
            card: '#FAFAFA',
            text: '#212121',
            secondaryText: '#757575',
            border: '#E0E0E0',
            work: '#FF5722',
            break: '#2196F3',
            longBreak: '#9C27B0',
            sliderMin: '#FFB700',
            sliderMax: '#E0E0E0',
        },
        dark: {
            primary: '#FFB700',
            background: '#121212',
            card: '#1E1E1E',
            text: '#FFFFFF',
            secondaryText: '#B0B0B0',
            border: '#333333',
            work: '#FF7043',
            break: '#64B5F6',
            longBreak: '#BA68C8',
            sliderMin: '#FFB700',
            sliderMax: '#444444',
        }
    };

    const currentColors = colors[theme];

    // Toggle theme
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
        if (isHapticFeedbackEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };



    // Play sound
    const playSound = async () => {
        if (!isSoundEnabled || !sound) return;

        try {
            await sound.replayAsync();
        } catch (error) {
            console.log('Error playing sound:', error);
        }
    };

    // Vibrate
    const vibrate = () => {
        if (!isHapticFeedbackEnabled) return;

        if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
            Vibration.vibrate([500, 500, 500]);
        }
    };

    // Format time (mm:ss)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Start timer with animation
    const startTimer = () => {
        setIsActive(true);

        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.03,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    timerComplete();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Pause timer
    const pauseTimer = () => {
        setIsActive(false);
        scaleAnim.setValue(1); // Reset animation
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    // Reset timer
    const resetTimer = () => {
        pauseTimer();
        setMode('work');
        setSessionsCompleted(0);
        setTimeLeft(workTime * 60);
    };


    // Skip current timer
    const skipTimer = () => {
        pauseTimer();
        timerComplete();
    };

    // Change mode manually
    const changeMode = (newMode: TimerMode) => {
        pauseTimer();
        setMode(newMode);
        setSessionsCompleted(0);

        switch (newMode) {
            case 'work':
                setTimeLeft(workTime * 60);
                break;
            case 'break':
                setTimeLeft(breakTime * 60);
                break;
            case 'longBreak':
                setTimeLeft(longBreakTime * 60);
                break;
        }
    };

    // Trigger confetti animation
    const triggerConfettiAnimation = () => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 1000,
                delay: 1000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Effect for loading sound
    useEffect(() => {
        loadSound(selectedSound);

        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [selectedSound, volume]);

    // Effect for when work/break times change
    useEffect(() => {
        if (!isActive) {
            if (mode === 'work') {
                setTimeLeft(workTime * 60);
            } else if (mode === 'break') {
                setTimeLeft(breakTime * 60);
            } else {
                setTimeLeft(longBreakTime * 60);
            }
        }
    }, [workTime, breakTime, longBreakTime]);

    // Effect for theme change listener
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        });

        return () => subscription.remove();
    }, []);

    // Get mode color
    const getModeColor = () => {
        switch (mode) {
            case 'work': return currentColors.work;
            case 'break': return currentColors.break;
            case 'longBreak': return currentColors.longBreak;
            default: return currentColors.primary;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={()=> router.back()} style={styles.themeButton}>
                    <Feather
                        name="arrow-left"
                        size={24}
                        color={currentColors.text}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: currentColors.text }]}>Pomodoro Focus</Text>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
                    <Feather
                        name={theme === 'light' ? 'moon' : 'sun'}
                        size={24}
                        color={currentColors.text}
                    />
                </TouchableOpacity>
            </View>

            {/* Timer Display */}
            <Animated.View
                style={[
                    styles.timerContainer,
                    {
                        transform: [{ scale: scaleAnim }],
                        borderColor: getModeColor(),
                    }
                ]}
            >
                <Text style={[styles.timerText, { color: currentColors.text }]}>
                    {formatTime(timeLeft)}
                </Text>
                <Text style={[styles.modeText, { color: getModeColor() }]}>
                    {mode === 'work' ? 'Focus Time' :
                        mode === 'break' ? 'Short Break' : 'Long Break'}
                </Text>
            </Animated.View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                {Array.from({ length: longBreakInterval }).map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.progressDot,
                            { backgroundColor: currentColors.border },
                            i < sessionsCompleted % longBreakInterval && {
                                backgroundColor: getModeColor(),
                            }
                        ]}
                    />
                ))}
            </View>

            {/* Timer Controls */}
            <View style={styles.controlsContainer}>
                {!isActive ? (
                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: currentColors.primary }]}
                        onPress={startTimer}
                    >
                        <Ionicons name="play" size={32} color={currentColors.background} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.controlButton, { backgroundColor: '#FF5722' }]}
                        onPress={pauseTimer}
                    >
                        <Ionicons name="pause" size={32} color={currentColors.background} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: currentColors.break }]}
                    onPress={skipTimer}
                >
                    <MaterialIcons name="skip-next" size={32} color={currentColors.background} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.controlButton, { backgroundColor: currentColors.secondaryText }]}
                    onPress={resetTimer}
                >
                    <MaterialIcons name="replay" size={32} color={currentColors.background} />
                </TouchableOpacity>
            </View>

            {/* Settings Toggle */}
            <TouchableOpacity
                style={styles.settingsToggle}
                onPress={() => {
                    setShowSettings(!showSettings);
                    if (isHapticFeedbackEnabled) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                }}
            >
                <Animated.View style={{
                    transform: [{
                        rotate: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '180deg']
                        })
                    }]
                }}>
                    <Feather
                        name={showSettings ? 'chevron-up' : 'chevron-down'}
                        size={28}
                        color={currentColors.text}
                    />
                </Animated.View>
                <Text style={[styles.settingsToggleText, { color: currentColors.text }]}>
                    {showSettings ? 'Hide Settings' : 'Show Settings'}
                </Text>
            </TouchableOpacity>

            {/* Configuration Panel */}
            {showSettings && (
                <ScrollView
                    style={[
                        styles.configContainer,
                        { backgroundColor: currentColors.card }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Mode Selector */}
                    <View style={styles.modeSelector}>
                        <TouchableOpacity
                            style={[
                                styles.modeButton,
                                { backgroundColor: currentColors.border },
                                mode === 'work' && {
                                    backgroundColor: currentColors.work,
                                }
                            ]}
                            onPress={() => changeMode('work')}
                        >
                            <Text style={[
                                styles.modeButtonText,
                                { color: currentColors.text },
                                mode === 'work' && { color: '#FFFFFF' }
                            ]}>
                                Work
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.modeButton,
                                { backgroundColor: currentColors.border },
                                mode === 'break' && {
                                    backgroundColor: currentColors.break,
                                }
                            ]}
                            onPress={() => changeMode('break')}
                        >
                            <Text style={[
                                styles.modeButtonText,
                                { color: currentColors.text },
                                mode === 'break' && { color: '#FFFFFF' }
                            ]}>
                                Break
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.modeButton,
                                { backgroundColor: currentColors.border },
                                mode === 'longBreak' && {
                                    backgroundColor: currentColors.longBreak,
                                }
                            ]}
                            onPress={() => changeMode('longBreak')}
                        >
                            <Text style={[
                                styles.modeButtonText,
                                { color: currentColors.text },
                                mode === 'longBreak' && { color: '#FFFFFF' }
                            ]}>
                                Long Break
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* Notification Settings */}
                    <View style={[styles.settingGroup, { backgroundColor: currentColors.background }]}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>Notification Settings</Text>
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabelContainer}>
                                <Ionicons name="notifications-outline" size={20} color={currentColors.text} />
                                <Text style={[styles.switchLabel, { color: currentColors.text }]}>
                                    Enable Notifications
                                </Text>
                            </View>
                            <Switch
                                value={areNotificationsEnabled}
                                onValueChange={async (value) => {
                                    setAreNotificationsEnabled(value);
                                    if (value) {
                                        await registerForPushNotificationsAsync();
                                    } else {
                                        await cancelAllNotifications();
                                    }
                                }}
                                trackColor={{ false: currentColors.border, true: currentColors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                    {/* Time Settings */}
                    <View style={[styles.settingGroup, { backgroundColor: currentColors.background }]}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>Time Settings (minutes)</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLabelContainer}>
                                <Ionicons name="time-outline" size={20} color={currentColors.work} />
                                <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                                    Work Time: {workTime}
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={60}
                                step={1}
                                value={workTime}
                                onValueChange={setWorkTime}
                                minimumTrackTintColor={currentColors.work}
                                maximumTrackTintColor={currentColors.border}
                                thumbTintColor={currentColors.work}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLabelContainer}>
                                <Ionicons name="cafe-outline" size={20} color={currentColors.break} />
                                <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                                    Break Time: {breakTime}
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={30}
                                step={1}
                                value={breakTime}
                                onValueChange={setBreakTime}
                                minimumTrackTintColor={currentColors.break}
                                maximumTrackTintColor={currentColors.border}
                                thumbTintColor={currentColors.break}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLabelContainer}>
                                <Ionicons name="bed-outline" size={20} color={currentColors.longBreak} />
                                <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                                    Long Break Time: {longBreakTime}
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={5}
                                maximumValue={30}
                                step={1}
                                value={longBreakTime}
                                onValueChange={setLongBreakTime}
                                minimumTrackTintColor={currentColors.longBreak}
                                maximumTrackTintColor={currentColors.border}
                                thumbTintColor={currentColors.longBreak}
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLabelContainer}>
                                <Ionicons name="repeat-outline" size={20} color={currentColors.primary} />
                                <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                                    Long Break After: {longBreakInterval} sessions
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={2}
                                maximumValue={8}
                                step={1}
                                value={longBreakInterval}
                                onValueChange={setLongBreakInterval}
                                minimumTrackTintColor={currentColors.primary}
                                maximumTrackTintColor={currentColors.border}
                                thumbTintColor={currentColors.primary}
                            />
                        </View>
                    </View>

                    {/* Sound Settings */}
                    <View style={[styles.settingGroup, { backgroundColor: currentColors.background }]}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>Sound Settings</Text>

                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabelContainer}>
                                <Ionicons name="volume-high-outline" size={20} color={currentColors.text} />
                                <Text style={[styles.switchLabel, { color: currentColors.text }]}>
                                    Enable Sounds
                                </Text>
                            </View>
                            <Switch
                                value={isSoundEnabled}
                                onValueChange={setIsSoundEnabled}
                                trackColor={{ false: currentColors.border, true: currentColors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLabelContainer}>
                                <Ionicons name="musical-notes-outline" size={20} color={currentColors.text} />
                                <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                                    Alarm Sound
                                </Text>
                            </View>
                            <View style={styles.soundOptions}>
                                {alarmSounds.map(sound => (
                                    <TouchableOpacity
                                        key={sound.id}
                                        style={[
                                            styles.soundOption,
                                            {
                                                backgroundColor: currentColors.border,
                                                opacity: isSoundEnabled ? 1 : 0.6
                                            },
                                            selectedSound === sound.id && {
                                                backgroundColor: currentColors.primary,
                                            }
                                        ]}
                                        onPress={() => setSelectedSound(sound.id)}
                                        disabled={!isSoundEnabled}
                                    >
                                        <Feather
                                            name={sound.icon as keyof typeof Feather.glyphMap}
                                            size={16}
                                            color={
                                                selectedSound === sound.id ?
                                                    currentColors.background :
                                                    currentColors.text
                                            }
                                        />
                                        <Text style={[
                                            styles.soundOptionText,
                                            {
                                                color: selectedSound === sound.id ?
                                                    currentColors.background :
                                                    currentColors.text
                                            },
                                        ]}>
                                            {sound.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.settingItem}>
                            <View style={styles.settingLabelContainer}>
                                <Ionicons name="volume-medium-outline" size={20} color={currentColors.text} />
                                <Text style={[styles.settingLabel, { color: currentColors.text }]}>
                                    Volume: {Math.round(volume * 100)}%
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={1}
                                step={0.1}
                                value={volume}
                                onValueChange={setVolume}
                                minimumTrackTintColor={currentColors.primary}
                                maximumTrackTintColor={currentColors.border}
                                thumbTintColor={currentColors.primary}
                                disabled={!isSoundEnabled}
                            />
                        </View>
                    </View>

                    {/* Haptic Feedback */}
                    <View style={[styles.settingGroup, { backgroundColor: currentColors.background }]}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>Haptic Feedback</Text>
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabelContainer}>
                                <Ionicons name="phone-portrait-outline" size={20} color={currentColors.text} />
                                <Text style={[styles.switchLabel, { color: currentColors.text }]}>
                                    Enable Vibration
                                </Text>
                            </View>
                            <Switch
                                value={isHapticFeedbackEnabled}
                                onValueChange={setIsHapticFeedbackEnabled}
                                trackColor={{ false: currentColors.border, true: currentColors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>

                    {/* Timer Behavior */}
                    <View style={[styles.settingGroup, { backgroundColor: currentColors.background }]}>
                        <Text style={[styles.settingTitle, { color: currentColors.text }]}>Timer Behavior</Text>
                        <View style={styles.switchContainer}>
                            <View style={styles.switchLabelContainer}>
                                <Ionicons name="play-circle-outline" size={20} color={currentColors.text} />
                                <Text style={[styles.switchLabel, { color: currentColors.text }]}>
                                    Auto-start next timer
                                </Text>
                            </View>
                            <Switch
                                value={autoStartNextTimer}
                                onValueChange={setAutoStartNextTimer}
                                trackColor={{ false: currentColors.border, true: currentColors.primary }}
                                thumbColor="#FFFFFF"
                            />
                        </View>
                    </View>
                </ScrollView>
            )}

            {/* Confetti Animation (hidden by default) */}
            <Animated.View style={[
                styles.confettiContainer,
                { opacity: fadeAnim }
            ]}>
                {[...Array(50)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.confetti,
                            {
                                backgroundColor: [
                                    currentColors.primary,
                                    currentColors.work,
                                    currentColors.break,
                                    currentColors.longBreak
                                ][i % 4],
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                transform: [
                                    { rotate: `${Math.random() * 360}deg` },
                                    { scale: Math.random() * 0.5 + 0.5 }
                                ]
                            }
                        ]}
                    />
                ))}
            </Animated.View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    notificationTokenContainer: {
        marginTop: 10,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F0F0F0',
    },
    notificationTokenLabel: {
        fontSize: 12,
        marginBottom: 4,
    },
    notificationToken: {
        fontSize: 12,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    themeButton: {
        padding: 8,
        borderRadius: 20,
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        padding: 30,
        borderRadius: 20,
        borderWidth: 4,
    },
    timerText: {
        fontSize: 72,
        fontWeight: '200',
    },
    modeText: {
        fontSize: 24,
        marginTop: 8,
        fontWeight: '600',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    controlButton: {
        marginHorizontal: 12,
        padding: 15,
        borderRadius: 50,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    progressDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 5,
    },
    configContainer: {
        maxHeight: Dimensions.get('window').height * 0.5,
        borderRadius: 15,
        marginBottom: 10,
        padding: 15,
    },
    modeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    modeButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingGroup: {
        marginBottom: 20,
        borderRadius: 12,
        padding: 15,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    settingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    settingItem: {
        marginBottom: 20,
    },
    settingLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    settingLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
    soundOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    soundOption: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 10,
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    soundOptionText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 8,
        flex: 1,
    },
    settingsToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        marginBottom: 15,
    },
    settingsToggleText: {
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '500',
    },
    confettiContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
    },
    confetti: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
});

export default PomodoroTimer;