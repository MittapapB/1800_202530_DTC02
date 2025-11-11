import { logoutUser } from "/src/js/authentication.js";
import { auth } from "/src/js/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

function initProfilePage() {
  const logoutBtn = document.getElementById("toLogout");
  const authButtons = document.getElementById("authButtons");
  const profileSections = document.getElementById("profileSections");
  const userInfo = document.getElementById("userInfo");
  const userName = document.getElementById("userName");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      authButtons.classList.add("hidden");
      profileSections.classList.remove("hidden");
      userInfo.classList.remove("hidden");

      const displayName = user.displayName || user.email || "User";
      userName.textContent = displayName;
    } else {
      authButtons.classList.remove("hidden");
      profileSections.classList.add("hidden");
      userInfo.classList.add("hidden");

      window.location.href = "/src/pages/sign-in.html";
    }
  });

  logoutBtn?.addEventListener("click", logoutUser);
}

document.addEventListener("DOMContentLoaded", initProfilePage);
