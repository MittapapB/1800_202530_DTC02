import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { logoutUser } from "/src/js/authentication.js";
import { auth, db, storage } from "/src/js/firebaseConfig.js";
import {
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

let currentUser = null;

function initProfilePage() {
  // Debug log
  console.log("Initializing profile page...");

  // Get DOM elements
  const logoutBtn = document.getElementById("toLogout");
  const authButtons = document.getElementById("authButtons");
  const userName = document.getElementById("userName");
  const profileImage = document.getElementById("profileImage");
  const fileInput = document.getElementById("profileImageInput");
  const updateProfileBtn = document.getElementById("updateProfileBtn");
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  const formContainer = document.getElementById("profileFormContainer");
  const passwordContainer = document.getElementById("changePasswordContainer");
  const profileForm = document.getElementById("profileForm");
  const passwordForm = document.getElementById("changePasswordForm");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const closePasswordBtn = document.getElementById("closePasswordFormBtn");
  const passwordError = document.getElementById("passwordError");
  const passwordSuccess = document.getElementById("passwordSuccess");

  // Debug
  console.log("Elements found:", {
    logoutBtn: !!logoutBtn,
    userName: !!userName,
    profileImage: !!profileImage,
    fileInput: !!fileInput,
    updateProfileBtn: !!updateProfileBtn,
    changePasswordBtn: !!changePasswordBtn,
    formContainer: !!formContainer,
    passwordContainer: !!passwordContainer,
    profileForm: !!profileForm,
    passwordForm: !!passwordForm,
    closeFormBtn: !!closeFormBtn,
    closePasswordBtn: !!closePasswordBtn,
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
        document.getElementById("fullNameInput").value = data.name || "";
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

  // Change Password button
  changePasswordBtn?.addEventListener("click", () => {
    if (!currentUser) {
      alert("Please sign in to change your password.");
      return;
    }

    // Clear any previous messages
    if (passwordError) passwordError.classList.add("hidden");
    if (passwordSuccess) passwordSuccess.classList.add("hidden");

    // Reset form
    if (passwordForm) passwordForm.reset();

    // Show modal
    passwordContainer.classList.remove("hidden");
    passwordContainer.classList.add("flex");
  });

  // Close
  closeFormBtn?.addEventListener("click", () => {
    formContainer.classList.add("hidden");
    formContainer.classList.remove("flex");
  });

  closePasswordBtn?.addEventListener("click", () => {
    passwordContainer.classList.add("hidden");
    passwordContainer.classList.remove("flex");
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
          name,
          phone,
          city,
          updatedAt: Date.now(),
        },
        { merge: true },
      );

      // Update display name
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

  // Password form submission
  passwordForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const currentPass = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    // Clear previous messages
    if (passwordError) {
      passwordError.classList.add("hidden");
      passwordError.textContent = "";
    }
    if (passwordSuccess) {
      passwordSuccess.classList.add("hidden");
      passwordSuccess.textContent = "";
    }

    // Validation
    if (newPass.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    if (newPass !== confirmPass) {
      showError("New passwords do not match");
      return;
    }

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPass,
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, newPass);

      // Show success message
      showSuccess("Password updated successfully!");

      // Reset form
      passwordForm.reset();

      // Close modal
      setTimeout(() => {
        passwordContainer.classList.add("hidden");
        passwordContainer.classList.remove("flex");
      }, 2000); // 2 seconds
    } catch (error) {
      console.error("Password update error:", error);

      // Handle specific errors
      switch (error.code) {
        case "auth/wrong-password":
          showError("Current password is incorrect");
          break;
        case "auth/weak-password":
          showError(
            "New password is too weak. Please use a stronger password.",
          );
          break;
        case "auth/requires-recent-login":
          showError("Session expired. Please log in again and try.");
          setTimeout(() => {
            logoutUser();
          }, 1500);
          break;
        default:
          showError("Failed to update password. Please try again.");
      }
    }
  });

  // Helper functions
  function showError(message) {
    if (passwordError) {
      passwordError.textContent = message;
      passwordError.classList.remove("hidden");
    }
  }

  function showSuccess(message) {
    if (passwordSuccess) {
      passwordSuccess.textContent = message;
      passwordSuccess.classList.remove("hidden");
    }
  }

  // Auth state listener
  onAuthStateChanged(auth, (user) => {
    // Debug log
    console.log("Auth state changed:", user);

    if (!user) {
      window.location.href = "/src/pages/sign-in.html";
      return;
    }

    currentUser = user;

    // Hide auth buttons
    if (authButtons) authButtons.classList.add("hidden");

    // Update name
    if (userName) {
      const displayName = user.displayName || user.email || "User";
      userName.textContent = `Hi, ${displayName}`;
      userName.classList.remove("hidden");
    }

    // Update profile image
    if (profileImage && user.photoURL) {
      profileImage.src = user.photoURL;
    }
  });

  // Logout
  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    logoutUser();
  });
}

// Migration function to fix previous bug. (used fullName instead of name)
async function migrateUserNames() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const batch = writeBatch(db);

  usersSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.fullName && !data.name) {
      batch.update(doc.ref, {
        name: data.fullName,
      });
    }
  });

  await batch.commit();
  console.log("User names migrated successfully");
}

// accordion function
function toggleAccordion(id) {
  const content = document.getElementById(`content-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  const allContents = document.querySelectorAll('[id^="content-"]');
  const allIcons = document.querySelectorAll('[id^="icon-"]');

  const isOpen = !content.classList.contains("hidden");

  // Close
  allContents.forEach((el) => el.classList.add("hidden"));
  allIcons.forEach((el) => el.classList.remove("rotate-180"));

  // Toggle
  if (!isOpen) {
    content.classList.remove("hidden");
    if (icon) {
      icon.classList.add("rotate-180");
    }
  }
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProfilePage);
} else {
  initProfilePage();
}

window.toggleAccordion = toggleAccordion;
