import { db, auth } from "./firebaseConfig.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const starContainer = document.getElementById("star-rating");
const paintStars = (n) => {
  [...starContainer.querySelectorAll("svg")].forEach((el) => {
    const v = Number(el.dataset.value || 0);
    el.setAttribute("fill", v <= n ? "#fa9500" : "none");
  });
  starContainer.dataset.rating = String(n);
};

let current = 0;
starContainer.addEventListener("click", (e) => {
  const svg = e.target.closest("svg");
  if (!svg) return;
  current = Number(svg.dataset.value || 0);
  paintStars(current);
});
paintStars(0);

onAuthStateChanged(auth, (user) => {
  const form = document.getElementById("add-time-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    const url = new URL(window.location.href);
    const restaurantId = url.searchParams.get("restaurant_id");

    const waitTime = parseInt(document.getElementById("waiting-time").value);
    const dateStr = document.getElementById("record-date").value;
    const timeStr = document.getElementById("record-time").value;
    const comments = (document.getElementById("feedback")?.value || "").trim();
    const rating = Number(starContainer?.dataset.rating || 0);

    await addDoc(collection(db, "restaurant", restaurantId, "time_record"), {
      user_id: user.uid,
      wait_time_minutes: waitTime,
      visit_timestamp: timeStr,
      visit_datestamp: dateStr,
      rating: rating,
      comments: comments,
      submitted_at: serverTimestamp(),
    });

    const restaurantRef = doc(db, "restaurant", restaurantId);
    const restaurantDoc = await getDoc(restaurantRef);

    if (restaurantDoc.exists()) {
      const data = restaurantDoc.data();
      const prevTotal = data.total_record_number || 0;
      const prevAvg = data.avg_wait_time || 0;

      const newTotal = prevTotal + 1;
      const newAvg = (prevAvg * prevTotal + waitTime) / newTotal;

      await updateDoc(restaurantRef, {
        total_record_number: newTotal,
        avg_wait_time: newAvg,
      });
    }

    alert("Wait time submitted!");
  });
});
// document.addEventListener("DOMContentLoaded", () => {
//   const submitBtn = document.querySelector(".submit-record");

//   if (submitBtn) {
//     submitBtn.addEventListener("click", (e) => {
//       e.preventDefault();
//       console.log("Record submitted successfully!");
//     });
//   }
// });
