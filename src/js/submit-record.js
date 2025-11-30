import { db, auth } from "./firebaseConfig.js";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
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
if (starContainer) {
  starContainer.addEventListener("click", (e) => {
    const svg = e.target.closest("svg");
    if (!svg) return;
    current = Number(svg.dataset.value || 0);
    paintStars(current);
  });
}
paintStars(0);

const url = new URL(window.location.href);
const restaurantId = decodeURIComponent(url.searchParams.get("restaurant-id"));
const restaurantRef = doc(db, "restaurant", restaurantId);
const restaurantDoc = await getDoc(restaurantRef);
if (restaurantDoc.exists()) {
  document.getElementById("restaurant-name").textContent =
    restaurantDoc.data().name;
}

onAuthStateChanged(auth, (user) => {
  const form = document.getElementById("add-time-form");
  const errorMsg = document.getElementById("errorMsg");
  const confirmation = document.getElementById("confirmation");

  const showError = (msg) => {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
    errorMsg.style.opacity = "1";

    setTimeout(() => {
      errorMsg.style.opacity = "0";
    }, 3000);
  };

  const showConfirmation = (msg) => {
    confirmation.textContent = msg;
    confirmation.classList.remove("hidden");
    confirmation.style.opacity = "1";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    try {
      const waitTime = parseInt(document.getElementById("waiting-time").value);
      const dateStr = document.getElementById("record-date").value;
      const timeStr = document.getElementById("record-time").value;
      const visitDate = new Date(`${dateStr}T${timeStr}`);
      const visitTimestamp = Timestamp.fromDate(visitDate);
      const comments = (document.getElementById("feedback").value || "").trim();
      const rating = Number(starContainer.dataset.rating || 0);

      await addDoc(collection(db, "restaurant", restaurantId, "time_record"), {
        user_id: user.uid,
        wait_time_minutes: waitTime,
        visit_timestamp: visitTimestamp,
        rating: rating,
        comments: comments,
        submitted_at: serverTimestamp(),
      });

      const restaurantSnapshot = await getDoc(restaurantRef);
      if (restaurantSnapshot.exists()) {
        const data = restaurantSnapshot.data();
        const prevTotal = data.total_record_number || 0;
        const prevAvg = data.avg_wait_time || 0;

        const newTotal = prevTotal + 1;
        const newAvg = (prevAvg * prevTotal + waitTime) / newTotal;

        await updateDoc(restaurantRef, {
          total_record_number: newTotal,
          avg_wait_time: newAvg,
        });
      }
      showConfirmation("Record submitted sucessfully!");

      // Reset form + stars
      form.reset();
      paintStars(0);

      setTimeout(() => {
        const encodeParam = encodeURIComponent(restaurantId);
        const targetPage = "restaurant-info.html";
        window.location.href = `${targetPage}?restaurant-id=${encodeParam}`;
      }, 3000);
    } catch (err) {
      console.error(err);
      showError("Failed to submit record. Please try again.");
      return;
    }
  });
});
