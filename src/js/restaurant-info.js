import { db } from "./firebaseConfig.js";
import { doc, getDoc } from "firebase/firestore";

const url = new URL(window.location.href);
const restaurantId = url.searchParams.get("restaurant-id");

function addRecordBtnSetup() {
  if (restaurantId) {
    const addRecordBtn = document.getElementById("add-record-btn");
    if (addRecordBtn) {
      addRecordBtn.href = `./add-record.html?restaurant-id=${restaurantId}`;
    }
  }
}

async function loadRestaurantData() {
  try {
    const RestaurantRef = doc(db, "restaurant", restaurantId);

    const RestaurantDoc = await getDoc(RestaurantRef);

    if (!RestaurantDoc.exists()) {
      console.log("Restaurant not found");
      return;
    }

    const data = RestaurantDoc.data();
    console.log(data);

    document.getElementById("restaurant-name").textContent = data.name;
    document.getElementById("overview-name").textContent = data.name;
    document.getElementById("overview-cuisine").textContent = data.cuisine;
    document.getElementById("overview-address").textContent = data.address;
    document.getElementById("overview-avg").textContent =
      data.avg_wait_time.toFixed(1);
  } catch (err) {
    console.error("Error loading restaurant:", err);
  }
}

if (restaurantId) {
  console.log("in");
  loadRestaurantData();
  addRecordBtnSetup();
}
