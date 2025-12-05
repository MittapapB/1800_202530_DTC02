import { db, auth } from "./firebaseConfig.js";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  serverTimestamp,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// get the restaurant ID from the URL query parameter
const url = new URL(window.location.href);
const restaurantId = decodeURIComponent(url.searchParams.get("restaurant-id"));
let restaurantName = "";

// elements for favorite button and heart icon
const favBtn = document.getElementById("fav-btn");
const favIconPath = document.getElementById("fav-path");
let currentUser = null;
let favoriteDocId = null;

// listen for user authentication changes
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUser = user;
  // check if this restaurant is already in user's favorites
  await checkIsFavorite();
  // add click listener to favorite button
  favBtn.addEventListener("click", toggleFavorite);
});

// check if the restaurant is already a favorite
async function checkIsFavorite() {
  const favRef = collection(db, "users", currentUser.uid, "favorite_list");
  const snapshot = await getDocs(favRef);

  favoriteDocId = null;

  // loop through user's favorites to see if this restaurant exists
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.restaurant_id === restaurantId) {
      favoriteDocId = docSnap.id;
    }
  });

  setHeart(favoriteDocId !== null);
}

function setHeart(isFav) {
  if (isFav) {
    favIconPath.setAttribute("fill", "#EB6424");
    favIconPath.setAttribute("stroke", "#EB6424");
  } else {
    favIconPath.setAttribute("fill", "none");
    favIconPath.setAttribute("stroke", "currentColor");
  }
}

// toggle favorite status when user clicks the heart
async function toggleFavorite() {
  if (!currentUser) return;
  const confirmModal = document.getElementById("confirm-modal");

  // if not faved, add it to fav
  if (!favoriteDocId) {
    confirmModal.open(
      "Add",
      `Add ${restaurantName} to your favorites?`,
      async () => {
        const docRef = await addDoc(
          collection(db, "users", currentUser.uid, "favorite_list"),
          { restaurant_id: restaurantId, created_at: serverTimestamp() }
        );
        favoriteDocId = docRef.id;
        setHeart(true);
      }
    );
    return;
  }

  // if already faved, remove it
  confirmModal.open(
    "Remove",
    `Remove ${restaurantName} from your favorites?`,
    async () => {
      await deleteDoc(
        doc(db, "users", currentUser.uid, "favorite_list", favoriteDocId)
      );
      favoriteDocId = null;
      setHeart(false);
    }
  );
}

// setup the "Add Record" button link with restaurant ID
function addRecordBtnSetup() {
  if (restaurantId) {
    const addRecordBtn = document.getElementById("add-record-btn");
    if (addRecordBtn) {
      addRecordBtn.href = `./add-record.html?restaurant-id=${encodeURIComponent(
        restaurantId
      )}`;
    }
  }
}

// load restaurant data from Firestore and populate the page
async function loadRestaurantData() {
  try {
    const RestaurantRef = doc(db, "restaurant", restaurantId);

    const RestaurantDoc = await getDoc(RestaurantRef);

    if (!RestaurantDoc.exists()) {
      return;
    }

    const data = RestaurantDoc.data();
    restaurantName = data.name;

    // populate page elements with restaurant info
    document.getElementById("restaurant-name").textContent = data.name;
    document.getElementById("overview-name").textContent = data.name;
    document.getElementById("overview-cuisine").textContent = data.cuisine;
    document.getElementById("overview-address").textContent = data.address;
    // if no time record yet, display msg instead of 0 min
    const avgEl = document.getElementById("overview-avg");
    let avg = data.avg_wait_time;
    if (!avg || isNaN(avg)) {
      avgEl.textContent = "No time record yet.";
      avgEl.style.color = "gray";
      avgEl.style.fontStyle = "italic";
    } else {
      avgEl.textContent = avg.toFixed(1) + " minutes";
      avgEl.style.color = "";
      avgEl.style.fontStyle = "";
    }

    const restaurantImg = document.getElementById("restaurant-img");
    if (restaurantImg) {
      restaurantImg.src = data.image_url || "../../images/MealWaveLogo.png";
      restaurantImg.alt = data.name || "Restaurant";
    }
  } catch (err) {
    console.error("Error loading restaurant:", err);
  }
}

// initialize page
if (restaurantId) {
  loadRestaurantData();
  addRecordBtnSetup();
}
