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

// visually fill stars based on rating n
const paintStars = (n) => {
  [...starContainer.querySelectorAll("svg")].forEach((el) => {
    const v = Number(el.dataset.value || 0);
    el.setAttribute("fill", v <= n ? "#fa9500" : "none");
  });
  // store current rating in container
  starContainer.dataset.rating = String(n);
};

let current = 0;
// add click event listener to the star container
if (starContainer) {
  starContainer.addEventListener("click", (e) => {
    const svg = e.target.closest("svg");
    if (!svg) return; // exit if click is outside a star
    current = Number(svg.dataset.value || 0); // update current rating
    paintStars(current); // update current rating
  });
}

// initialize stars to 0 (no rating)
paintStars(0);

const url = new URL(window.location.href);
const restaurantId = url.searchParams.get("restaurant-id");
const restaurantRef = doc(db, "restaurant", restaurantId);
// fetch restaurant data and display its name
const restaurantDoc = await getDoc(restaurantRef);
if (restaurantDoc.exists()) {
  document.getElementById("restaurant-name").textContent =
    restaurantDoc.data().name;
}

onAuthStateChanged(auth, (user) => {
  const form = document.getElementById("add-time-form");
  const errorMsg = document.getElementById("errorMsg");
  const confirmation = document.getElementById("confirmation");

  // show error messages
  const showError = (msg) => {
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
    errorMsg.style.opacity = "1";

    setTimeout(() => {
      errorMsg.style.opacity = "0";
    }, 3000);
  };
  // show confirmation messages
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

      // convert date and time to a Firestore timestamp
      const visitDate = new Date(`${dateStr}T${timeStr}`);
      const visitTimestamp = Timestamp.fromDate(visitDate);

      const comments = (document.getElementById("feedback").value || "").trim();
      const rating = Number(starContainer.dataset.rating || 0);

      // add a new time record document under the restaurant's subcollection
      await addDoc(collection(db, "restaurant", restaurantId, "time_record"), {
        user_id: user.uid,
        wait_time_minutes: waitTime,
        visit_timestamp: visitTimestamp,
        rating: rating,
        comments: comments,
        submitted_at: serverTimestamp(),
      });

      // update restaurant's average wait time and total record count
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

      // redirect to restaurant page
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
