import { View, Image, Text, StyleSheet } from "react-native";

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/Logomain2.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        height: '100%',
    },
    logo: {
        aspectRatio: 1,
        width: 200,
        height: 200,
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontFamily: 'sans-serif',
        fontWeight: '600',
    },
    headerText: {
        flexDirection: 'column',
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    aiText: {
        color: 'white',
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 12,
        color: 'white',
    },
});