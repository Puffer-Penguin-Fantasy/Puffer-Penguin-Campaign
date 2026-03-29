import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

/**
 * Credits a referral if the current user was referred by someone.
 * @param currentUserAddress The wallet address of the user who just verified their NFT
 * @param referrerAddress The wallet address of the person who referred them
 * @returns true if credited successfully, false if already credited or invalid
 */
export async function creditReferral(currentUserAddress: string, referrerAddress: string): Promise<boolean> {
  if (!currentUserAddress || !referrerAddress || currentUserAddress === referrerAddress) {
    return false; // Cannot refer yourself
  }

  try {
    const userDocRef = doc(db, 'users', currentUserAddress);
    const userDoc = await getDoc(userDocRef);

    // If the user already exists and has a 'referredBy' field, they can't be referred again
    if (userDoc.exists() && userDoc.data()?.referredBy) {
      return false;
    }

    // Save the user and mark who referred them
    await setDoc(userDocRef, {
      referredBy: referrerAddress,
      verifiedAt: serverTimestamp()
    }, { merge: true });

    // Increment the referrer's total count
    const referrerDocRef = doc(db, 'users', referrerAddress);
    await setDoc(referrerDocRef, {
      totalReferrals: increment(1)
    }, { merge: true });

    return true;
  } catch (error) {
    console.error("Failed to credit referral in Firebase:", error);
    return false;
  }
}

/**
 * Fetches the total number of successful referrals for a given user.
 * @param address The wallet address to check
 * @returns The total number of referrals
 */
export async function getTotalReferrals(address: string): Promise<number> {
  if (!address) return 0;

  try {
    const docRef = doc(db, 'users', address);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data()?.totalReferrals) {
      return docSnap.data().totalReferrals;
    }
    return 0;
  } catch (error) {
    console.error("Failed to fetch total referrals:", error);
    return 0;
  }
}
