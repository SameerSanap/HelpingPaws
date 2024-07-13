import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, storage } from "../firebaseConfig";
import { router } from "expo-router";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { Alert } from "react-native";

export async function Login(form) {
  try {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Fill in all fields");
      return;
    }
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Error", "Failed to sign in. Please check your credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
  }
}

export async function Register(form) {
  const { email, password, username } = form;

  if (!email || !password || !username) {
    throw new Error("Fill all fields");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      email: email,
      username: username,
      userId: user.uid,
    });
    router.replace("/home");
  } catch (error) {
    throw new Error(error.message);
  }
}

// All posts
export async function getPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        documents.push({ id: doc.id, ...data });
      } else {
        console.error(`Document with ID ${doc.id} has no data`);
      }
    });

    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

// Single Post
export const getPost = async (docId) => {
  const docRef = doc(db, "posts", docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
};

// Single User
export const getUser = async (userId) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
};

// get all users
export async function getUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        documents.push({ id: doc.id, ...data });
      } else {
        console.error(`Document with ID ${doc.id} has no data`);
      }
    });

    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

// Function to delete a single post
async function deletePost(postId) {
  try {
    const docRef = doc(db, "posts", postId);
    await deleteDoc(docRef);
  } catch (err) {
    console.error("Error deleting post: ", err);
  }
}

// Function to delete an image
async function deleteImage(imagePath) {
  try {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
  } catch (err) {
    console.error("Error deleting image: ", err);
  }
}

// Function to delete a post and its associated images
export async function deletePostAndImages(postId, ownerUri, petUri) {
  try {
    // Get the post document
    const postDoc = await getDoc(doc(db, "posts", postId));
    if (postDoc.exists()) {
      const postData = postDoc.data();
      const userId = postData.userId;

      // Delete the post document
      await deletePost(postId);

      // Delete the associated images from storage

      const petImagePath = `images/${userId}/pet/${petUri}`;
      await deleteImage(petImagePath);

      const ownerImagePath = `images/${userId}/owner/${ownerUri}`;
      await deleteImage(ownerImagePath);

      console.log("Post and images deleted successfully.");
    } else {
      console.error("Post not found.");
    }
  } catch (err) {
    console.error("Error deleting post and images: ", err);
  }
}

// find by pet name
export async function getByName(name, fieldName, dbName) {
  const petsCollection = collection(db, dbName);
  const q = query(petsCollection, where(fieldName, "==", name));
  const querySnapshot = await getDocs(q);
  const pets = [];
  querySnapshot.forEach((doc) => {
    pets.push({ id: doc.id, ...doc.data() });
  });

  return pets;
}

// get NGO's

export async function getFoundations() {
  try {
    const querySnapshot = await getDocs(collection(db, "donation"));
    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data) {
        documents.push({ id: doc.id, ...data });
      } else {
        console.error(`Document with ID ${doc.id} has no data`);
      }
    });

    return documents;
  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
}

// get NGO

export async function getFoundation(id) {
  const docRef = doc(db, "donation", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

// adopted

export async function adoptPet(detail, adopter) {
  const data = { ...detail, adopter };
  await addDoc(collection(db, "adopted"), data);
}
