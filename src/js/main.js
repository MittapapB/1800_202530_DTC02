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

//randomly pick 6 restaurants
function randomPick(arr) {
  const randomRes = [...arr];
  for (let i = randomRes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomRes[i], randomRes[j]] = [randomRes[j], randomRes[i]];
  }
  return randomRes.slice(0, 6);
}

const grid = document.getElementById("restaurant-grid");

function cardTemplate({ id, name, address, image_url, avg_wait_time, index }) {
  const imgSrc = image_url ? image_url : `../../images/resto${index}.jpg`;
  const avg = avg_wait_time >= 0 ? `${avg_wait_time.toFixed(1)} min` : "—";

  const href = `./restaurant-info.html?restaurant-id=${id}`;

  return `
      <a href="${href}" class="bg-background-table rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition h-[300px]">
      
        
        <img
          src="${imgSrc}"
          alt="${name || "Restaurant"}"
          class="w-[200px] h-[120px] object-cover mx-auto"
        />
      

        <div class="flex flex-col p-4 justify-between">
          <div>
            <span class="font-bold sm:text-lg text-md text-title">${
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
          address: data.address,
          image_url: data.image_url,
          avg_wait_time: data.avg_wait_time,
          index: index,
        })
      );
      index += 1;
    });

    const sixRandom = randomPick(cards);

    // grid.innerHTML = cards.join("");
    grid.innerHTML = sixRandom.join("");
  } catch (err) {
    console.error(err);
  }
}

showDashboard();
loadRestaurants();
