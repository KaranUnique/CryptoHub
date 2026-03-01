import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../firebase";
import { getFirebaseErrorInfo } from "../utils/firebaseValidation";

/**
 * Toggles bookmark status for a blog post
 * @param {string} userId - Current user's ID
 * @param {number|string} blogId - ID of the blog post
 * @returns {Promise<boolean>} - Returns true if bookmarked, false if removed
 * @throws {Error} - Throws detailed error with user-friendly message
 */
export const toggleBookmark = async (userId, blogId) => {
    try {
        if (!userId) {
            const error = new Error("User must be logged in to bookmark");
            throw error;
        }

        if (!isFirebaseConfigured() || !db) {
            const error = new Error("Firebase is not configured");
            const errorInfo = getFirebaseErrorInfo(error, "Bookmark Toggle");
            throw new Error(errorInfo.message);
        }

        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Should not happen for logged in users, but safety check
            await setDoc(userRef, { bookmarks: [blogId] }, { merge: true });
            return true;
        }

        const userData = userDoc.data();
        const bookmarks = userData.bookmarks || [];
        const isBookmarked = bookmarks.includes(blogId);

        if (isBookmarked) {
            await updateDoc(userRef, {
                bookmarks: arrayRemove(blogId)
            });
            return false;
        } else {
            await updateDoc(userRef, {
                bookmarks: arrayUnion(blogId)
            });
            return true;
        }
    } catch (error) {
        const errorInfo = getFirebaseErrorInfo(error, "Bookmark Toggle");
        if (import.meta.env.DEV) {
            console.error("Error toggling bookmark:", errorInfo);
        }
        throw new Error(errorInfo.message || "Failed to update bookmark. Please try again.");
    }
};

/**
 * continued...
 * Fetches all bookmarked blog IDs for a user
 * @param {string} userId - Current user's ID
 * @returns {Promise<Array<string|number>>} - Array of bookmarked blog IDs
 * @throws {Error} - Throws detailed error with user-friendly message
 */
export const getBookmarks = async (userId) => {
    try {
        if (!userId) return [];

        if (!isFirebaseConfigured() || !db) {
            if (import.meta.env.DEV) {
                console.warn("Firebase is not configured. Bookmarks unavailable.");
            }
            return [];
        }

        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data().bookmarks || [];
        }

        return [];
    } catch (error) {
        const errorInfo = getFirebaseErrorInfo(error, "Bookmark Fetch");
        if (import.meta.env.DEV) {
            console.error("Error fetching bookmarks:", errorInfo);
        }
        // Return empty array instead of throwing - bookmarks are not critical
        return [];
    }
};
