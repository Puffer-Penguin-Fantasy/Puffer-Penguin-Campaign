import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export type QuestStatus = 'idle' | 'verifying' | 'completed';

export interface UserQuests {
  [questId: string]: QuestStatus;
}

/**
 * Saves or updates a quest status for a given user.
 * @param address The wallet address of the user
 * @param questId The unique ID of the quest (e.g., 'follow-arctic')
 * @param status The new status of the quest
 */
export async function saveQuestStatus(address: string, questId: string, status: QuestStatus): Promise<void> {
  if (!address) return;

  try {
    const userDocRef = doc(db, 'users', address);
    await setDoc(userDocRef, {
      quests: {
        [questId]: status
      },
      lastUpdated: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error(`Failed to save quest status (${questId}):`, error);
  }
}

/**
 * Fetches all quest statuses for a given user.
 * @param address The wallet address of the user
 * @returns A map of quest IDs to their statuses
 */
export async function getAllQuestStatuses(address: string): Promise<UserQuests> {
  if (!address) return {};

  try {
    const userDocRef = doc(db, 'users', address);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return docSnap.data().quests || {};
    }
  } catch (error) {
    console.error("Failed to fetch quest statuses:", error);
  }
  return {};
}
