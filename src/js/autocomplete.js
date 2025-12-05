import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const searchInput = document.getElementById("searchInput");
const suggestions = document.getElementById("suggestions");

let restaurants = [];

// Fetch restaurant names from Firestore for autocomplete
async function loadRestaurant() {
  try {
    const snap = await getDocs(collection(db, "restaurant"));
    restaurants = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      // store restaurant name and id
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

// Render the autocomplete dropdown
function renderSuggestions(items) {
  suggestions.innerHTML = "";

  // Hide dropdown when there are no matched
  if (!items.length) {
    suggestions.classList.add("hidden");
    return;
  }

  items.forEach((item) => {
    const div = document.createElement("div");
    div.className =
      "autocomplete-suggestion px-4 py-2 cursor-pointer hover:bg-[#eb6424] hover:text-[#fff8f0]";
    div.textContent = item.name;

    // Navigate to restaurant page when user selects an items
    div.addEventListener("click", () => {
      goToRestaurant(item.id);
    });

    suggestions.appendChild(div);
  });

  suggestions.classList.remove("hidden");
}

// Redirect to the  restaurant page
function goToRestaurant(restaurantId) {
  const url = `/src/pages/restaurant-info.html?restaurant-id=${encodeURIComponent(
    restaurantId
  )}`;
  window.location.href = url;
}

// Handle search input in real-time
searchInput.addEventListener("input", () => {
  const query = (searchInput.value || "").toLowerCase().trim();

  // Clear dropdown if query is empty
  if (!query) {
    suggestions.innerHTML = "";
    suggestions.classList.add("hidden");
    return;
  }

  // Filter matching restaurant names
  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(query)
  );

  renderSuggestions(filtered.slice(0, 5));
});

// Hide suggestions when clicking outside
document.addEventListener("click", (event) => {
  if (event.target !== searchInput && !suggestions.contains(event.target)) {
    suggestions.innerHTML = "";
    suggestions.classList.add("hidden");
  }
});

loadRestaurant();
