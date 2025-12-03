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

// get restaurant ID from URL query
const url = new URL(window.location.href);
const restaurantId = decodeURIComponent(url.searchParams.get("restaurant-id"));
let restaurantName = "";

const favBtn = document.getElementById("fav-btn");
const favIconPath = document.getElementById("fav-path");
let currentUser = null;
let favoriteDocId = null;

// listen to authentication state changes
onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUser = user;

  await checkIsFavorite();

  favBtn.addEventListener("click", toggleFavorite);
});

// check if current restaurant is already in user's favourites
async function checkIsFavorite() {
  const favRef = collection(db, "users", currentUser.uid, "favorite_list");
  const snapshot = await getDocs(favRef);

  favoriteDocId = null;

  // loop through favourite_list to see if this restaurant is already favourited
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.restaurant_id === restaurantId) {
      favoriteDocId = docSnap.id;
    }
  });

  setHeart(favoriteDocId !== null);
}

// update heart button based on favourite status
function setHeart(isFav) {
  if (isFav) {
    favIconPath.setAttribute("fill", "#EB6424");
    favIconPath.setAttribute("stroke", "#EB6424");
  } else {
    favIconPath.setAttribute("fill", "none");
    favIconPath.setAttribute("stroke", "currentColor");
  }
}

async function toggleFavorite() {
  if (!currentUser) return;
  const confirmModal = document.getElementById("confirm-modal");

  // if restaurant is not a favorite, add it
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

  // if restaurant is already a favorite, remove it
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

// setup "Add Record" button to link to add-record page with restaurant ID
function addRecordBtnSetup() {
  if (!restaurantId) return;

  const addRecordBtn = document.getElementById("add-record-btn");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      addRecordBtn.href = `./add-record.html?restaurant-id=${encodeURIComponent(
        restaurantId
      )}`;
    } else {
      addRecordBtn.href = "./sign-in.html";
    }
  });
  if (restaurantId) {
    const addRecordBtn = document.getElementById("add-record-btn");
    if (addRecordBtn) {
      addRecordBtn.href = `./add-record.html?restaurant-id=${encodeURIComponent(
        restaurantId
      )}`;
    }
  }
}

// load restaurant data from Firestore
async function loadRestaurantData() {
  try {
    const RestaurantRef = doc(db, "restaurant", restaurantId);

    const RestaurantDoc = await getDoc(RestaurantRef);

    if (!RestaurantDoc.exists()) {
      return;
    }

    const data = RestaurantDoc.data();
    restaurantName = data.name;

    if (!data.cuisine) {
      document
        .getElementById("overview-cuisine")
        .classList.remove("inline-flex");
      document.getElementById("overview-cuisine").classList.add("hidden");
    }

    // update DOM elements with restaurant info
    document.getElementById("restaurant-name").textContent = data.name;
    document.getElementById("overview-name").textContent = data.name;
    document.getElementById("overview-cuisine").textContent = data.cuisine;
    document.getElementById("overview-address").textContent = data.address;
    document.getElementById("overview-avg").textContent =
      data.avg_wait_time.toFixed(1);

    const restaurantImg = document.getElementById("restaurant-img");
    if (restaurantImg) {
      restaurantImg.src = data.image_url || "../../images/MealWaveLogo.png";
      restaurantImg.alt = data.name || "Restaurant";
    }
  } catch (err) {
    console.error("Error loading restaurant:", err);
  }
}

if (restaurantId) {
  //initialize page
  loadRestaurantData();
  addRecordBtnSetup();
}
