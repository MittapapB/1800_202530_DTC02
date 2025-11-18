import { db, storage } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const form = document.getElementById("addRestaurantForm");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("restaurantName").value.trim();
  const address = document.getElementById("address").value.trim();
  const cuisine = document.getElementById("cuisineType").value.trim();
  const imageFile = document.getElementById("image").files[0];

  const restaurantId = (name + "_" + address)
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll(",", "")
    .replaceAll(".", "");

  try {
    // check if dupliate exists
    const restaurantDocRef = doc(db, "restaurant", restaurantId);
    const restaurantDocSnap = await getDoc(restaurantDocRef);

    if (restaurantDocSnap.exists()) {
      alert("This restaurant already exists!");
      return;
    }

    let imageUrl = "";
    if (imageFile) {
      const storagePath = `restaurant_images/${restaurantId}/${Date.now()}-${
        imageFile.name
      }`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    // Create restaurant document
    await setDoc(restaurantDocRef, {
      name,
      address,
      cuisine: cuisine || "",
      image_url: imageUrl,
      avg_wait_time: 0,
    });

    confirmation.classList.remove("hidden");
    form.reset();
    const encodeParam = encodeURIComponent(restaurantId);
    const targetPage = "restaurant-info.html";
    window.location.href = `${targetPage}?restaurant-id=${encodeParam}`;
  } catch (error) {
    console.error("Error adding restaurant:", error);
    alert("Failed to add restaurant. Please try again.");
  }
});
