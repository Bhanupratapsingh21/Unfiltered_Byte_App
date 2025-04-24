import { databases } from '@/lib/appwrite'; // adjust path
import { ID, Query } from 'react-native-appwrite';
import { getTodayDate } from '@/lib/helpers'; // adjust path

const dbId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_STREAKS;

if (!dbId || !collectionId) {
    throw new Error('Database ID or Collection ID is not defined in environment variables.');
}

export const checkAndUpdateStreak = async (userId: string) => {
    const today = getTodayDate();

    const streakDoc = await databases.listDocuments(dbId, collectionId, [
        Query.equal('userId', userId),
    ]);

    if (streakDoc.total === 0) {
        // first check-in
        await databases.createDocument(dbId, collectionId, ID.unique(), {
            userId,
            lastCheckIn: today,
            streakCount: 1,
            longestStreak: 1,
        });
        return { streak: 1, longest: 1 };
    }

    const doc = streakDoc.documents[0];
    const lastCheckInDate = new Date(doc.lastCheckIn);
    const isSameDay = lastCheckInDate.toDateString() === today.toDateString();

    if (isSameDay) {
        return { streak: doc.streakCount, longest: doc.longestStreak };
    }

    const diff = Math.floor(
        (today.getTime() - lastCheckInDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = 1;
    if (diff === 1) {
        newStreak = doc.streakCount + 1;
    }

    const updated = await databases.updateDocument(dbId, collectionId, doc.$id, {
        lastCheckIn: today,
        streakCount: newStreak,
        longestStreak: Math.max(doc.longestStreak, newStreak),
    });

    return { streak: updated.streakCount, longest: updated.longestStreak };
};
