import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';

interface TabsProps {
    defaultValue: string;
    children: React.ReactNode;
}

interface TabsListProps {
    children: React.ReactNode;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
}

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (value: string) => void;
}>({
    activeTab: '',
    setActiveTab: () => { },
});

const Tabs = ({ defaultValue, children }: TabsProps) => {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <View style={styles.tabsContainer}>{children}</View>
        </TabsContext.Provider>
    );
};

const TabsList = ({ children }: TabsListProps) => {
    const colorScheme = useColorScheme();
    const borderColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

    return (
        <View style={[styles.tabsList, { borderColor }]}>
            {children}
        </View>
    );
};

const TabsTrigger = ({ value, children }: TabsTriggerProps) => {
    const { activeTab, setActiveTab } = React.useContext(TabsContext);
    const colorScheme = useColorScheme();
    const isActive = activeTab === value;

    const activeBgColor = colorScheme === 'dark' ? '#FFB700' : '#FFB700';
    const inactiveTextColor = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
    const activeTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

    return (
        <TouchableOpacity
            style={[
                styles.tabTrigger,
                isActive && { backgroundColor: "#FFB700" }
            ]}
            onPress={() => setActiveTab(value)}
        >
            <Text style={[
                styles.tabTriggerText,
                { color: isActive ? activeTextColor : inactiveTextColor }
            ]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const TabsContent = ({ value, children }: TabsContentProps) => {
    const { activeTab } = React.useContext(TabsContext);

    if (activeTab !== value) return null;

    return <View style={styles.tabContent}>{children}</View>;
};

const styles = StyleSheet.create({
    tabsContainer: {
        width: '100%',
    },
    tabsList: {
        width: '100%',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: "#fff",
        paddingVertical: 4,
        paddingHorizontal: 4,
        alignItems: "center",
        borderRadius: 30,
        justifyContent: "center",
        marginBottom: 5,
    },
    tabTrigger: {
        width: 'auto',
        borderRadius: 30,
        paddingHorizontal: 26,
        paddingVertical: 8,
    },
    tabTriggerText: {
        fontWeight: '500',
        fontSize: 14,
    },
    tabContent: {
        paddingVertical: 0,
    },
});

// Export the components
export { Tabs, TabsList, TabsTrigger, TabsContent };