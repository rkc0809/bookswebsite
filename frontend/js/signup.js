import { auth, db } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById('signup-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = form.username.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const confirmPassword = form['confirm-password'].value;

  if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  // Check if username already exists
  const userDoc = await getDoc(doc(db, "usernames", username));
  if (userDoc.exists()) {
    alert("Username already taken!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save username in a separate "usernames" collection to ensure uniqueness
    await setDoc(doc(db, "usernames", username), { uid: user.uid });

    // Save full user data in "users" collection
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      username,
      email
    });

    // Optional: update Firebase Auth profile
    await updateProfile(user, { displayName: username });

    // Redirect to login page
    window.location.href = "login.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message);
  }
});
