import { logoutUser } from "/src/js/authentication.js";
import { auth } from "/src/js/firebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";

function initProfilePage() {
  const logoutBtn = document.getElementById("toLogout");
  const authButtons = document.getElementById("authButtons");
  const userName = document.getElementById("userName");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (authButtons) authButtons.classList.add("hidden");

      if (userName) {
        userName.textContent = user.displayName || user.email;
        userName.classList.remove("hidden");
      }
    } else {
      window.location.href = "/src/pages/sign-in.html";
    }
  });

  logoutBtn?.addEventListener("click", logoutUser);
}

// function toggleAccordion(id) {
//   const content = document.getElementById(`content-${id}`);
//   const icon = document.getElementById(`icon-${id}`);
//   const allContents = document.querySelectorAll('[id^="content-"]');
//   const allIcons = document.querySelectorAll('[id^="icon-"]');
//
//   const isOpen = !content.classList.contains("hidden");
//
//   allContents.forEach((el) => el.classList.add("hidden"));
//   allIcons.forEach((el) => (el.textContent = "+"));
//
//   if (!isOpen) {
//     content.classList.remove("hidden");
//     icon.textContent = "−";
//   }
// }

document.addEventListener("DOMContentLoaded", initProfilePage);
