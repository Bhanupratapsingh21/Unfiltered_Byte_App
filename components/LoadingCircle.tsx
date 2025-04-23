import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

const Spinner = () => {
    // Create animation values for each spinner bar
    const animatedValues = Array.from({ length: 10 }, () => new Animated.Value(0));

    useEffect(() => {
        // Create animations for each bar
        const animations = animatedValues.map((value, index) => {
            return Animated.loop(
                Animated.timing(value, {
                    toValue: 1,
                    duration: 1000,
                    delay: index * 100,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            );
        });

        // Start all animations
        Animated.parallel(animations).start();

        // Clean up animations when component unmounts
        return () => {
            animations.forEach(anim => anim.stop());
        };
    }, []);

    // Render the spinner bars
    const renderBars = () => {
        return animatedValues.map((value, index) => {
            const rotation = (index * 36); // 360 degrees / 10 bars = 36 degrees per bar

            // Create the pulse animation
            const translateY = value.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [15, 22.5, 15], // 150% to 225% back to 150% of base height
            });

            return (
                <Animated.View
                    key={index}
                    style={[
                        styles.bar,
                        {
                            transform: [
                                { rotate: `${rotation}deg` },
                                { translateY },
                            ],
                        },
                    ]}
                />
            );
        });
    };

    return (
        <View style={styles.container}>
            {renderBars()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 5,
        height: 5,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bar: {
        position: 'absolute',
        width: '50%',
        height: '150%',
        backgroundColor: '#ffffff',
        transformOrigin: 'center bottom',
    },
});

export default Spinner;