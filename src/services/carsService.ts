import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Car } from '../types/car';
import { initialCars } from '../data/cars';

const CARS_COLLECTION = 'cars';

/**
 * Subscribe to real-time car updates from Firestore.
 * Automatically seeds initial cars if database collection is empty.
 */
export const subscribeCars = (onCarsUpdated: (cars: Car[]) => void) => {
  const carsRef = collection(db, CARS_COLLECTION);

  const unsubscribe = onSnapshot(carsRef, async (snapshot) => {
    if (snapshot.empty) {
      console.log('Firestore cars collection is empty. Seeding initial fleet...');
      await seedInitialCars();
      return;
    }

    const carsList: Car[] = [];
    snapshot.forEach((docSnap) => {
      carsList.push(docSnap.data() as Car);
    });

    // Sort by ID descending so newest cars appear first
    carsList.sort((a, b) => String(b.id).localeCompare(String(a.id)));
    onCarsUpdated(carsList);
  }, (error) => {
    console.error('Error fetching cars from Firestore:', error);
  });

  return unsubscribe;
};

/**
 * Seed initial default cars into Firestore
 */
export const seedInitialCars = async () => {
  try {
    const batch = writeBatch(db);
    initialCars.forEach((car) => {
      const carDocRef = doc(db, CARS_COLLECTION, car.id.toString());
      batch.set(carDocRef, car);
    });
    await batch.commit();
    console.log('Successfully seeded initial cars into Firestore.');
  } catch (err) {
    console.error('Failed to seed initial cars:', err);
  }
};

/**
 * Save or update a single car in Firestore
 */
export const saveCarToFirestore = async (car: Car) => {
  try {
    const carRef = doc(db, CARS_COLLECTION, car.id.toString());
    await setDoc(carRef, car, { merge: true });
  } catch (err) {
    console.error('Error saving car to Firestore:', err);
    throw err;
  }
};

/**
 * Delete a car from Firestore
 */
export const deleteCarFromFirestore = async (carId: number) => {
  try {
    const carRef = doc(db, CARS_COLLECTION, carId.toString());
    await deleteDoc(carRef);
  } catch (err) {
    console.error('Error deleting car from Firestore:', err);
    throw err;
  }
};

/**
 * Toggle car availability in Firestore
 */
export const toggleCarAvailabilityInFirestore = async (carId: number, available: boolean) => {
  try {
    const carRef = doc(db, CARS_COLLECTION, carId.toString());
    await setDoc(carRef, { available }, { merge: true });
  } catch (err) {
    console.error('Error updating car availability in Firestore:', err);
    throw err;
  }
};
