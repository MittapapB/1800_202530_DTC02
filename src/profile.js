import { logoutUser } from "/src/authentication.js";
import { auth } from "/src/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

function initProfilePage() {
  const logoutBtn = document.getElementById("toLogout");

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "/src/pages/sign-in.html";
    }
  });

  logoutBtn?.addEventListener("click", logoutUser);
}

document.addEventListener("DOMContentLoaded", initProfilePage);
