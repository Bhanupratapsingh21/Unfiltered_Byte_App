import React from "react";
import { Text, View, StyleSheet } from "react-native";

// Utility to render markdown-style **bold** text inside paragraphs
function renderFormattedText(text: string) {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);

    return parts.map((part, index) =>
        index % 2 === 1 ? (
            <Text key={index} style={styles.bold}>
                {part}
            </Text>
        ) : (
            <Text key={index}>{part}</Text>
        )
    );
}

interface ReadingSheetProps {
    content: string;
}

const ReadingSheet: React.FC<ReadingSheetProps> = ({ content }) => {
    const paragraphs = content.trim().split(/\n\s*\n/); // split on empty lines

    return (
        <View style={styles.container}>
            {paragraphs.map((para, idx) => (
                <Text key={idx} style={styles.paragraph}>
                    {renderFormattedText(para)}
                </Text>
            ))}
        </View>
    );
};

export default ReadingSheet;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: "#B0B0B0",
        marginBottom: 16,
    },
    bold: {
        fontWeight: "bold",
        color: "#FFFFFF",
    },
});
