import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

let restaurants = [];

async function loadRestaurant() {
  try {
    const snap = await getDocs(collection(db, "restaurant"));
    restaurants = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data?.name && docSnap.id) {
        restaurants.push({
          id: docSnap.id,
          name: data.name.trim(),
        });
      }
    });
  } catch (err) {
    console.error("Failed to load restaurant names:", err);
  }
}

function renderSuggestions(items) {
  suggestions.innerHTML = "";
  if (!items.length) {
    suggestions.classList.add("hidden");
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "autocomplete-suggestion px-4 py-2 cursor-pointer hover:bg-[#eb6424] hover:text-[#fff8f0]";
    div.textContent = item.name;
    div.addEventListener("click", () => {
      goToRestaurant(item.id);
    });
    suggestions.appendChild(div);
  });

  suggestions.classList.remove("hidden");
}

function goToRestaurant(restaurantId) {
  const url = `/src/pages/restaurant-info.html?restaurant-id=${encodeURIComponent(
    restaurantId
  )}`;
  window.location.href = url;
}

searchInput.addEventListener("input", () => {
  const query = (searchInput.value || "").toLowerCase().trim();
  if (!query) {
    suggestions.innerHTML = "";
    suggestions.classList.add("hidden");
    return;
  }

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query)
  );

  renderSuggestions(filtered.slice(0, 5));
});

document.addEventListener("click", (event) => {
  if (event.target !== searchInput && !suggestions.contains(event.target)) {
    suggestions.innerHTML = "";
    suggestions.classList.add("hidden");
  }
});

loadRestaurant();
