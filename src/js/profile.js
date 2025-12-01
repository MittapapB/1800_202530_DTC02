import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { logoutUser } from "/src/js/authentication.js";
import { auth, db, storage } from "/src/js/firebaseConfig.js";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

let currentUser = null;

function initProfilePage() {
  console.log("Initializing profile page..."); // Debug log

  // Get DOM elements with null checks
  const logoutBtn = document.getElementById("toLogout");
  const authButtons = document.getElementById("authButtons");
  const userName = document.getElementById("userName");
  const profileImage = document.getElementById("profileImage");
  const fileInput = document.getElementById("profileImageInput");
  const updateProfileBtn = document.getElementById("updateProfileBtn");
  const formContainer = document.getElementById("profileFormContainer");
  const profileForm = document.getElementById("profileForm");
  const closeFormBtn = document.getElementById("closeFormBtn");

  // Debug: Check if elements exist
  console.log("Elements found:", {
    logoutBtn: !!logoutBtn,
    userName: !!userName,
    profileImage: !!profileImage,
    fileInput: !!fileInput,
    updateProfileBtn: !!updateProfileBtn,
    formContainer: !!formContainer,
    profileForm: !!profileForm,
    closeFormBtn: !!closeFormBtn,
  });

  // Profile image upload
  fileInput?.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const storagePath = `user_profiles/${currentUser.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, storagePath);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update auth profile
      await updateProfile(currentUser, { photoURL: downloadURL });

      // Update Firestore
      await updateDoc(userDocRef, {
        avatar: downloadURL,
        updatedAt: Date.now(),
      });

      // Update UI
      profileImage.src = downloadURL;
      alert("Profile image updated successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again.");
    }
  });

  // Update profile button
  updateProfileBtn?.addEventListener("click", async () => {
    if (!currentUser) {
      alert("Please sign in to update your profile.");
      return;
    }

    try {
      // Load existing data
      const userDocRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        document.getElementById("fullNameInput").value = data.fullName || "";
        document.getElementById("phoneInput").value = data.phone || "";
        document.getElementById("cityInput").value = data.city || "";
      }

      // Show modal
      formContainer.classList.remove("hidden");
      formContainer.classList.add("flex");
    } catch (error) {
      console.error("Error loading profile data:", error);
      alert("Error loading profile data.");
    }
  });

  // Close form button
  closeFormBtn?.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    formContainer.classList.remove("flex");
  });

  // Profile form submission
  profileForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const fullName = document.getElementById("fullNameInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const city = document.getElementById("cityInput").value.trim();

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        {
          fullName,
          phone,
          city,
          updatedAt: Date.now(),
        },
        { merge: true },
      );

      // Update display name if changed
      if (fullName && fullName !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: fullName });
      }

      alert("Profile information updated successfully!");
      formContainer.classList.add("hidden");
      formContainer.classList.remove("flex");

      // Refresh user data
      if (userName) {
        userName.textContent = fullName || currentUser.email;
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Could not update your profile. Please try again.");
    }
  });

  // Auth state listener
  onAuthStateChanged(auth, (user) => {
    console.log("Auth state changed:", user); // Debug log

    if (!user) {
      window.location.href = "/src/pages/sign-in.html";
      return;
    }

    currentUser = user;

    // Hide auth buttons if they exist
    if (authButtons) authButtons.classList.add("hidden");

    // Update user name
    if (userName) {
      userName.textContent = user.displayName || user.email;
      userName.classList.remove("hidden");
    }

    // Update profile image
    if (profileImage && user.photoURL) {
      profileImage.src = user.photoURL;
    }
  });

  // Logout button
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
  });
}

// Add this function to your profile.js
function toggleAccordion(id) {
  const content = document.getElementById(`content-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  const allContents = document.querySelectorAll('[id^="content-"]');
  const allIcons = document.querySelectorAll('[id^="icon-"]');

  const isOpen = !content.classList.contains("hidden");

  // Close all accordions
  allContents.forEach((el) => el.classList.add("hidden"));
  allIcons.forEach((el) => el.classList.remove("rotate-180"));

  // Toggle current accordion
  if (!isOpen) {
    content.classList.remove("hidden");
    if (icon) {
      icon.classList.add("rotate-180");
    }
  }
}
// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProfilePage);
} else {
  initProfilePage();
}

window.toggleAccordion = toggleAccordion;
