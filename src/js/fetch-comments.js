// fetch-comments.js
import { db } from "./firebaseConfig.js";
import {
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";

const default_avatar = "/images/default-avatar.jpg";

export async function fetchUserComments() {
  const params = new URLSearchParams(window.location.search);
  const restaurantId = decodeURIComponent(params.get("restaurant-id") || "");

  const container = document.getElementById("comments-container");
  if (!container) return;
  container.innerHTML = "<p class='text-gray-500 text-center'>Loading...</p>";

  try {
    if (!restaurantId) {
      console.warn("fetchUserComments: missing restaurant-id query param");
      container.innerHTML =
        "<p class='text-gray-500 text-center'>No restaurant specified.</p>";
      return;
    }

    if (!db || typeof db !== "object") {
      console.error("fetchUserComments: 'db' is not a Firestore instance:", db);
      throw new Error("Invalid Firestore instance");
    }

    const recordsRef = collection(
      db,
      "restaurant",
      restaurantId,
      "time_record"
    );
    const searchQuery = query(
      recordsRef,
      orderBy("submitted_at", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(searchQuery);

    if (snapshot.empty) {
      container.innerHTML =
        "<p class='text-gray-500 text-center'>No comments yet.</p>";
      return;
    }

    container.innerHTML = "";

    const promises = snapshot.docs.map(async (docSnap) => {
      const record = docSnap.data();
      const userId = record.user_id;
      let user = { name: "Anonymous", avatar: default_avatar };

      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          user.name = data.name || "Anonymous";
          user.avatar = data.avatar || default_avatar;
        }
      }

      //get and format visit_timestamp data from firebase
      let visitTime = "-";
      if (record.visit_timestamp && record.visit_timestamp.toDate) {
        const dateObj = record.visit_timestamp.toDate(); // Firestore Timestamp → JS Date
        visitTime = dateObj.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      return { record, user, visitTime };
    });

    const results = await Promise.all(promises);

    results.forEach(({ record, user, visitTime }) => {
      const card = document.createElement("div");
      card.className =
        "flex items-start gap-4 p-4 mb-4 bg-white rounded-2xl shadow-sm border border-gray-100";

      const avatarUrl = user.avatar || default_avatar;

      const maxStars = 5;
      const filledStars = record.rating || 0;
      const starsHtml = Array.from({ length: maxStars }, (_, i) => {
        return `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 ${
          i < filledStars ? "fill-current text-[#89AC46]" : "text-gray-300"
        }" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.917 1.536 8.277L12 18.896l-7.472 4.604 1.536-8.277L0 9.306l8.332-1.151z"/></svg>`;
      }).join("");

      card.innerHTML = `
        <img src="${avatarUrl}" alt="User avatar" class="w-12 h-12 rounded-full object-cover border border-gray-200" />
        <div class="flex-1">
          <div class="flex justify-between items-center">
            <h4 class="font-semibold text-title">${
              user.name || "Anonymous"
            }</h4>
            <p class="text-sm text-gray-500 font-semibold flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#EB6424]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

              Waited: <span class="font-bold text-[#EB6424]">${
                record.wait_time_minutes || "-"
              } min</span>
            </p>
          </div>
          <div class="flex items-center mt-1 mb-2">${starsHtml}</div>
          <p class="text-gray-700 text-sm md:text-base leading-relaxed">
            ${record.comments || "(No comment)"}
          </p>
           <p class="text-gray-400 text-xs mt-1">Visited: ${visitTime}</p> 
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p class='text-red-500 text-center'>Failed to load comments.</p>";
  }
}

fetchUserComments();
