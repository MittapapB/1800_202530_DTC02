import { db, auth } from "./firebaseConfig.js";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const favoritesList = document.getElementById("favorites-list");
let favoriteMap = {};

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "./sign-in.html";
    return;
  }

  await loadFavoritesForUser(user.uid);

  favoritesList.addEventListener("click", async (e) => {
    e.preventDefault();

    const card = e.target.closest(".restaurant-card");
    if (!card) return;

    const restaurantId = card.dataset.id;
    if (!restaurantId) return;

    const deleteBtn = e.target.closest(".delete-btn");
    if (deleteBtn) {
      await DeleteFavorite(user.uid, restaurantId);
      return;
    }
    sessionStorage.setItem("lastPage", window.location.pathname);
    window.location.href = `/src/pages/restaurant-info.html?restaurant-id=${encodeURIComponent(
      restaurantId
    )}`;
  });
});

async function DeleteFavorite(userId, restaurantId) {
  const modal = document.getElementById("confirm-modal");
  const favorite = favoriteMap[restaurantId];

  modal.open(
    "Remove",
    `Remove ${favorite.restaurantName} from your favorites?`,
    async () => {
      const favoriteId = favorite.favoriteId;
      const favDocRef = doc(db, "users", userId, "favorite_list", favoriteId);

      await deleteDoc(favDocRef);
      await loadFavoritesForUser(userId);
    }
  );
}

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

async function loadFavoritesForUser(uid) {
  try {
    favoritesList.innerHTML = "";
    favoriteMap = {};

    const favoritesRef = collection(db, "users", uid, "favorite_list");
    const favoriteDoc = await getDocs(favoritesRef);

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
    for (let element of favoriteDoc.docs) {
      const favData = element.data();
      const restaurantId = favData.restaurant_id;
      const favoriteId = element.id;

      const restaurantRef = doc(db, "restaurant", restaurantId);
      const restaurantSnap = await getDoc(restaurantRef);
      const restaurant = restaurantSnap.data();

      favoriteMap[restaurantId] = {
        favoriteId: favoriteId,
        restaurantName: restaurant.name,
      };

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

    favoritesList.innerHTML = cardHTML.join("");
  } catch (err) {
    console.error(err);
  }
}
