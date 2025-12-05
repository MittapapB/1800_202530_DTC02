import { onAuthStateChanged } from "firebase/auth";
import { onAuthReady } from "./authentication.js";
import { auth, db } from "./firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const grid = document.getElementById("restaurant-grid");
const addRestaurantBtn = document.getElementById("add-restaurant");

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

//randomly pick 6 restaurants
function randomPick(arr) {
  const randomRes = [...arr];
  for (let i = randomRes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomRes[i], randomRes[j]] = [randomRes[j], randomRes[i]];
  }
  return randomRes.slice(0, 6);
}

// Generate the HTML card for one restaurant
function cardTemplate({ id, name, address, image_url, avg_wait_time, index }) {
  const imgSrc = image_url ? image_url : `../../images/MealWaveLogo.png`;
  const avg = avg_wait_time >= 0 ? `${avg_wait_time.toFixed(1)} min` : "—";

  const href = `./restaurant-info.html?restaurant-id=${encodeURIComponent(id)}`;

  return `
      <a href="${href}" class="bg-background-table rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition w-[170px] sm:w-[200px] h-[250px]">

        <div class="w-full h-[110px] sm:h-[130px] overflow-hidden">
          <img
            src="${imgSrc}"
            alt="${name || "Restaurant"}"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex flex-col p-4 justify-between flex-1 space-y-2">
          <div class="space-y-1">
            <span class="font-bold sm:text-lg md:text-md text-sm text-title">${
              name || "Restaurant"
            }</span>
            <p class="text-secondary text-sm mt-2 truncate text-gray-900">${
              address || "No address available"
            }</p>
          </div>
          <span class="text-secondary mt-1">Avg Wait: ${avg}</span>
        </div>
      </a>
    `;
}

// Fetch restaurants from Firestore and display 6 random ones on the homepage
async function loadRestaurants() {
  try {
    const restaurantRef = collection(db, "restaurant");
    const restaurantDoc = await getDocs(restaurantRef);

    if (restaurantDoc.empty) {
      return;
    }

    const cards = [];
    let index = 1;
    // Loop through all restaurants in Firestore
    restaurantDoc.forEach((doc) => {
      const data = doc.data();
      // Build and store the HTML card for each restaurant
      cards.push(
        cardTemplate({
          id: doc.id,
          name: data.name,
          address: data.address,
          image_url: data.image_url,
          avg_wait_time: data.avg_wait_time,
          index: index,
        })
      );
      index += 1;
    });

    const sixRandom = randomPick(cards);
    // Render 6 random restaurants into the page
    grid.innerHTML = sixRandom.join("");
  } catch (err) {
    console.error(err);
  }
}

// Redirect user depending on login state
addRestaurantBtn.addEventListener("click", (event) => {
  event.preventDefault();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Logged in → go to add restaurant form
      window.location.href = "./add-restaurant.html";
    } else {
      // Not logged in → ask to sign in
      window.location.href = "./sign-in.html";
    }
  });
});

showDashboard();
loadRestaurants();
