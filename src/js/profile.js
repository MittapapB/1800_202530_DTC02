import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { logoutUser } from "/src/js/authentication.js";
import { auth, storage } from "/src/js/firebaseConfig.js";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "./firebaseConfig";

let currentUser = null;

function initProfilePage() {
  const logoutBtn = document.getElementById("toLogout");
  const authButtons = document.getElementById("authButtons");
  const userName = document.getElementById("userName");

  const profileImage = document.getElementById("profileImage");
  const fileInput = document.getElementById("profileImageInput");

  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!currentUser) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      const storagePath = `user_profiles/${currentUser.uid}/${Date.now()}-${
        file.name
      }`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(currentUser, { photoURL: downloadURL });

      profileImage.src = downloadURL;

      await updateDoc(userDocRef, {
        avatar: downloadURL,
      });

      alert("Profile Updated.");
    } catch (error) {
      console.error("Upload Failed.", error);
      alert("Faild to upload image.");
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "/src/pages/sign-in.html";
      return;
    }
    currentUser = user;

    if (authButtons) authButtons.classList.add("hidden");

    if (userName) {
      userName.textContent = user.displayName || user.email;
      userName.classList.remove("hidden");
    }

    if (profileImage && user.photoURL) {
      profileImage.src = user.photoURL;
    }
  });

  logoutBtn?.addEventListener("click", logoutUser);
}

function toggleAccordion(id) {
  const content = document.getElementById(`content-${id}`);
  const allContents = document.querySelectorAll('[id^="content-"]');

  const isOpen = !content.classList.contains("hidden");

  allContents.forEach((el) => el.classList.add("hidden"));

  if (!isOpen) {
    content.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", initProfilePage);
window.toggleAccordion = toggleAccordion;
