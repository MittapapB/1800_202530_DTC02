import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// get fav container
const favoritesList = document.getElementById("favorites-list");
let favoriteMap = {};

// Handle user login state
onAuthStateChanged(auth, async (user) => {
  // Redirect to sign-in page if not logged in
  if (!user) {
    window.location.href = "./sign-in.html";
    return;
  }
  // load the current user's favorites
  await loadFavoritesForUser(user.uid);

  // Handle click events inside the favorites list
  favoritesList.addEventListener("click", async (e) => {
    e.preventDefault();

    const card = e.target.closest(".restaurant-card");
    if (!card) return;

    const restaurantId = card.dataset.id;
    if (!restaurantId) return;

    // Handle delete button clicked
    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      // call delete function if delete button clicked
      await DeleteFavorite(user.uid, restaurantId);
      return;
    }

    // Save last page for back button navigation
    sessionStorage.setItem("lastPage", window.location.pathname);

    // Open restaurant page
    window.location.href = `/src/pages/restaurant-info.html?restaurant-id=${encodeURIComponent(
      restaurantId
    )}`;
  });
});

// Handle delete action for a user's favorite restaurant
async function DeleteFavorite(userId, restaurantId) {
  const modal = document.getElementById("confirm-modal");

  // Retrieve favorite info (favoriteId + restaurantName)
  const favorite = favoriteMap[restaurantId];

  // Open confirmation modal
  // Arguments (buttonLabel, message, callback)
  modal.open(
    "Remove",
    `Remove ${favorite.restaurantName} from your favorites?`,
    async () => {
      const favoriteId = favorite.favoriteId;
      const favDocRef = doc(db, "users", userId, "favorite_list", favoriteId);

      // Delete from Firestore
      await deleteDoc(favDocRef);
      // Reload updated favorites list
      await loadFavoritesForUser(userId);
    }
  );
}

// Generate HTML card for one restaurant
function cardTemplate({ id, name, address, image_url, avg_wait_time }) {
  const imgSrc = image_url ? image_url : "../../images/MealWaveLogo.png";
  const avg = avg_wait_time >= 0 ? `${avg_wait_time.toFixed(1)} min` : "—";

  return `
    <div class="w-full">
      <div data-id="${id}" class="restaurant-card bg-background-table rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition mb-4">
        <img
          src="${imgSrc}"
          alt="${name ? name : "Restaurant"}"
          class="w-full h-32 object-cover rounded-t-lg"
        />

        <div class="flex flex-col p-4 min-h-fit">
          <div class="flex flex-row justify-between">
            <div>
              <span class="font-bold sm:text-lg text-md text-title">${
                name || "Restaurant"
              }</span>
              <p class="text-secondary text-sm text-gray-900">${
                address || "No address available"
              }</p>
            </div>
            <button
              type="button"
              class="delete-btn text-[#fa9500] hover:text-[#eb6424] hover:cursor-pointer"
            >
              <i class="fa-solid fa-trash text-lg"></i>
            </button>
          </div>
          <span class="text-green-dark mt-1">Avg Wait: ${avg}</span>
        </div>
      </div>
    </div>
    `;
}

// Load and render user's favorite restaurants
async function loadFavoritesForUser(uid) {
  try {
    favoritesList.innerHTML = "";
    favoriteMap = {};

    const favoritesRef = collection(db, "users", uid, "favorite_list");
    const favoriteDoc = await getDocs(favoritesRef);

    // Show no favorites yet
    if (favoriteDoc.empty) {
      favoritesList.innerHTML = `
      <div
        class="max-w-2xl w-9/12 mx-auto my-20 p-4 bg-backgroud-card rounded-2xl shadow-md"
      >
        <p class='text-gray-500 text-center'>You don't have any favorites yet.</p>
      </div>
    `;
      return;
    }

    const cardHTML = [];
    // Loop through user's favorites
    for (let element of favoriteDoc.docs) {
      const favData = element.data();
      const restaurantId = favData.restaurant_id;
      const favoriteId = element.id;

      // Fetch restaurant details
      const restaurantRef = doc(db, "restaurant", restaurantId);
      const restaurantSnap = await getDoc(restaurantRef);
      const restaurant = restaurantSnap.data();

      // Store reference for deletion
      favoriteMap[restaurantId] = {
        favoriteId: favoriteId,
        restaurantName: restaurant.name,
      };

      // Build and store the HTML card for each restaurant
      cardHTML.push(
        cardTemplate({
          id: restaurantId,
          name: restaurant.name,
          address: restaurant.address,
          image_url: restaurant.image_url,
          avg_wait_time: restaurant.avg_wait_time,
        })
      );
    }

    // Render all user's favorites on the page
    favoritesList.innerHTML = cardHTML.join("");
  } catch (err) {
    console.error(err);
  }
}
