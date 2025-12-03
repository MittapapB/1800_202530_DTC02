import { db, storage } from "./firebaseConfig.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const form = document.getElementById("addRestaurantForm");
const confirmation = document.getElementById("confirmation");

let selectedPlace = null;

window.initPlaces = function () {
  const nameInput = document.getElementById("restaurantName");
  const addressInput = document.getElementById("address");

  const autocomplete = new google.maps.places.Autocomplete(nameInput, {
    types: ["establishment"],
    componentRestrictions: { country: "ca" },
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    selectedPlace = place;

    if (place && place.name) {
      nameInput.value = place.name;
    }

    // if (!place || !place.place_id) {
    //   showFieldError(
    //     "restaurantNameError",
    //     "Please select a restaurant from the suggestions."
    //   );
    //   return;
    // }

    //check it's actually a restaurant
    // const isRestaurant = place.types && place.types.includes("restaurant");
    // if (!isRestaurant) {
    //   showFieldError(
    //     "restaurantNameError",
    //     "Please choose a restaurant, not another type of place."
    //   );
    // } else {
    //   clearFieldError("restaurantNameError");
    // }

    // auto-fill address if available
    if (place.formatted_address) {
      addressInput.value = place.formatted_address;
      clearFieldError("addressError");
    }
  });
};

function showFieldError(id, message) {
  const elementDiv = document.getElementById(id);
  if (!elementDiv) return;
  elementDiv.textContent = message;
  elementDiv.classList.remove("hidden");
}

function clearFieldError(id) {
  const elementDiv = document.getElementById(id);
  if (!elementDiv) return;
  elementDiv.classList.add("hidden");
}

//validate all fields before inserting to Firestore
function validateForm() {
  let isValid = true;

  const nameInput = document.getElementById("restaurantName");
  const addressInput = document.getElementById("address");
  const cuisineInput = document.getElementById("cuisineType");
  const imageInput = document.getElementById("image");

  const name = nameInput.value.trim();
  const address = addressInput.value.trim();
  const cuisine = cuisineInput.value.trim();
  const imageFile = imageInput.files[0];

  // clear old errors
  clearFieldError("restaurantNameError");
  clearFieldError("addressError");
  clearFieldError("cuisineError");
  clearFieldError("imageError");

  // Restaurant name required
  if (!name) {
    showFieldError("restaurantNameError", "Please enter the restaurant name.");
    isValid = false;
  }

  // if (
  //   !selectedPlace ||
  //   !selectedPlace.place_id ||
  //   selectedPlace.name !== name
  // ) {
  //   showFieldError(
  //     "restaurantNameError",
  //     "Please select a restaurant from the suggestions."
  //   );
  //   isValid = false;
  // }

  //Address: required (usually auto-filled by Places)
  if (!address) {
    showFieldError("addressError", "Address is required.");
    isValid = false;
  }

  // Cuisine type: no numbers allowed
  if (cuisine && /\d/.test(cuisine)) {
    showFieldError("cuisineError", "Numbers are not allowed in cuisine types.");
    isValid = false;
  }

  // Image: if provided, must be < 2MB
  const MAX_SIZE_BYTES = 2 * 1024 * 1024;
  if (imageFile && imageFile.size > MAX_SIZE_BYTES) {
    showFieldError("imageError", "Please upload an image smaller than 2MB.");
    isValid = false;
  }

  return { isValid, name, address, cuisine, imageFile };
}

document.getElementById("restaurantName").addEventListener("input", (event) => {
  const val = event.target.value.trim();
  if (!val) {
    showFieldError("restaurantNameError", "Please enter the restaurant name.");
  } else {
    clearFieldError("restaurantNameError");
  }
});

// Address
document.getElementById("address").addEventListener("input", (event) => {
  const val = event.target.value.trim();
  // number + optional space + street name
  const streetPattern = /^\d+\s?[A-Za-z].*$/;
  if (!streetPattern.test(val)) {
    showFieldError(
      "addressError",
      "Address must include street number and street name."
    );
  } else {
    clearFieldError("addressError");
  }
});

// Cuisine Type
document.getElementById("cuisineType").addEventListener("input", (event) => {
  const val = event.target.value.trim();
  if (/\d/.test(val)) {
    showFieldError("cuisineError", "Numbers are not allowed in cuisine types.");
  } else {
    clearFieldError("cuisineError");
  }
});

// Image size check when user picks file
document.getElementById("image").addEventListener("change", (event) => {
  const file = e.target.files[0];
  if (file && file.size > 2 * 1024 * 1024) {
    showFieldError("imageError", "Please upload an image smaller than 2MB.");
  } else {
    clearFieldError("imageError");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const { isValid, name, address, cuisine, imageFile } = validateForm();
  if (!isValid) {
    return;
  }

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
      const errorMsg = document.getElementById("errorMsg");
      errorMsg.textContent = "This restaurant already exists!";
      errorMsg.classList.remove("hidden");
      errorMsg.style.opacity = "1";

      setTimeout(() => {
        errorMsg.style.opacity = "0";
      }, 3000);

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
  function showError(msg) {
    const errorMsg = document.getElementById("errorMsg");
    errorMsg.textContent = msg;
    errorMsg.classList.remove("hidden");
    errorMsg.style.opacity = "1";

    setTimeout(() => {
      errorMsg.style.opacity = "0";
    }, 3000);
  }

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
