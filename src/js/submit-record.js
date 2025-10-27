document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector(".submit-record");

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Record submitted successfully!");
    });
  }
});
