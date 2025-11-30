import { db, storage } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const form = document.getElementById("addRestaurantForm");
const confirmation = document.getElementById("confirmation");

// add eventlistener for form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // get user input values from form
  const name = document.getElementById("restaurantName").value.trim();
  const address = document.getElementById("address").value.trim();
  const cuisine = document.getElementById("cuisineType").value.trim();
  const imageFile = document.getElementById("image").files[0];

  // generate unique restaurant ID based on name + address
  const restaurantId = (name + "_" + address)
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll(",", "")
    .replaceAll(".", "");

  try {
    // check if dupliate exists
    const restaurantDocRef = doc(db, "restaurant", restaurantId);
    const restaurantDocSnap = await getDoc(restaurantDocRef);

    // if restaurant exists, show error message and exit
    if (restaurantDocSnap.exists()) {
      const errorMsg = document.getElementById("errorMsg");
      errorMsg.textContent = "This restaurant already exists!";
      errorMsg.classList.remove("hidden");
      errorMsg.style.opacity = "1";

      // hide after 3 seconds
      setTimeout(() => {
        errorMsg.style.opacity = "0";
      }, 3000);

      return;
    }
    //  // if user uploaded an image, upload to Firebase Storage
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

    // Show popup message
    showConfirmation("Restaurant added successfully!");
    // Reset form
    form.reset();

    // Wait 3 seconds before auto navigating
    setTimeout(() => {
      const encodeParam = encodeURIComponent(restaurantId);
      const targetPage = "restaurant-info.html";
      window.location.href = `${targetPage}?restaurant-id=${encodeParam}`;
    }, 3000);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    showError("Failed to add restaurant. Please try again.");
  }
  // show error message
  function showError(msg) {
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
    errorMsg.style.opacity = "1";

    setTimeout(() => {
      errorMsg.style.opacity = "0";
    }, 3000);
  }
  // show confirmation message
  function showConfirmation(msg) {
    const confirmation = document.getElementById("confirmation");
    confirmation.textContent = msg;
    confirmation.classList.remove("hidden");
    confirmation.style.opacity = "1";

    setTimeout(() => {
      confirmation.style.opacity = "0";
    }, 3000);
  }
});
