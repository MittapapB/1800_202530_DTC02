import { onAuthReady } from "./authentication.js";
import { db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

function showDashboard() {
  const nameElement = document.getElementById("name-goes-here"); // the <h1> element to display "Hello, {name}"

  // Wait for Firebase to determine the current authentication state.
  // onAuthReady() runs the callback once Firebase finishes checking the signed-in user.
  // The user's name is extracted from the Firebase Authentication object
  // You can "go to console" to check out current users.
  onAuthReady((user) => {
    if (!user) {
      nameElement.textContent = "";
      return;
    }

    // If a user is logged in:
    // Use their display name if available, otherwise show their email.
    const name = user.displayName || user.email;

    // Update the welcome message with their name/email.
    if (nameElement) {
      nameElement.textContent = `, ${name}!`;
    }
  });
}

const grid = document.getElementById("restaurant-grid");

function cardTemplate({ id, name, image_url, avg_wait_time, index }) {
  const imgSrc = image_url ? image_url : `../../images/resto${index}.jpg`;
  const avg = avg_wait_time >= 0 ? `${avg_wait_time.toFixed(1)} min` : "—";

  const href = `./restaurant-info.html?restaurant-id=${id}`;

  return `
      <a href="${href}" class="bg-background-table rounded-lg shadow-sm overflow-hidden flex flex-col items-center p-4 hover:shadow-md transition">
        <img
          src="${imgSrc}"
          alt="${name ? name : "Restaurant"}"
          class="w-full h-32 object-cover rounded-lg mb-2"
        />
        <span class="font-bold text-lg text-gray-900">${
          name || "Restaurant"
        }</span>
        <span class="text-secondary mt-1">Avg Wait: ${avg}</span>
      </a>
    `;
}

async function loadRestaurants() {
  try {
    // const restaurantId = url.searchParams.get("restaurant_id");
    const restaurantRef = collection(db, "restaurant");
    const restaurantDoc = await getDocs(restaurantRef);

    if (restaurantDoc.empty) {
      console.log("Restaurant not found");
      return;
    }

    const cards = [];
    let index = 1;
    restaurantDoc.forEach((doc) => {
      const data = doc.data();
      cards.push(
        cardTemplate({
          id: doc.id,
          name: data.name,
          image_url: data.image_url,
          avg_wait_time: data.avg_wait_time,
          index: index,
        })
      );
      index += 1;
    });

    grid.innerHTML = cards.join("");
  } catch (err) {
    console.error(err);
  }
}

showDashboard();
loadRestaurants();
