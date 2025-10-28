// // src/components/Navbar.js
// src/components/Navbar.js
export function Navbar() {
  const nav = document.createElement("nav");

  nav.innerHTML = `
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 w-[65%] max-w-md bg-[#FEF3E2] border border-[#f2e9da] rounded-3xl shadow-2xl flex justify-evenly items-center py-1 px-2">

    <div class="nav-item flex flex-col items-center justify-center gap-1 text-[#fa9500] p-1 rounded-2xl cursor-pointer transition-all duration-200" data-page="home">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 12l-2 0l9 -9l9 9l-2 0"/>
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"/>
        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"/>
      </svg>
      <span class="hidden md:text-xs font-medium">Home</span>
    </div>

    <div class="nav-item flex flex-col items-center justify-center gap-1 text-[#fa9500] p-1 rounded-2xl cursor-pointer transition-all duration-200" data-page="favorites">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"/>
      </svg>
      <span class="hidden md:text-xs font-medium">Favorites</span>
    </div>

    <div class="nav-item flex flex-col items-center justify-center gap-1 text-[#fa9500] p-1 rounded-2xl cursor-pointer transition-all duration-200" data-page="profile">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
        <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
        <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"/>
      </svg>
      <span class="hidden md:text-md font-medium">Profile</span>
    </div>

  </div>
`;

  nav
    .querySelector('[data-page="home"]')
    .addEventListener("click", () => (window.location.href = "./main.html"));
  nav
    .querySelector('[data-page="favorites"]')
    .addEventListener(
      "click",
      () => (window.location.href = "./favorites.html")
    );
  nav
    .querySelector('[data-page="profile"]')
    .addEventListener("click", () => (window.location.href = "./profile.html"));

  const path = window.location.pathname;
  let currentPage = "";
  if (path.includes("main.html")) currentPage = "home";
  else if (path.includes("favorites.html")) currentPage = "favorites";
  else if (path.includes("profile.html")) currentPage = "profile";

  nav.querySelectorAll(".nav-item").forEach((el) => {
    const svg = el.querySelector("svg");

    if (el.dataset.page === currentPage) {
      svg.setAttribute("fill", "#eb6424");
      svg.setAttribute("stroke", "#FAF3E2");
      el.querySelector("span").classList.add("text-[#eb6424]");
    } else {
      svg.setAttribute("fill", "none");
      svg.setAttribute("stroke", "#fa9500");
    }

    el.addEventListener("mouseenter", () => {
      if (el.dataset.page !== currentPage) {
        svg.setAttribute("stroke", "#eb6424");
        el.querySelector("span").classList.add("text-[#eb6424]");
      }
      svg.style.transform = "scale(1.1)";
    });
    el.addEventListener("mouseleave", () => {
      if (el.dataset.page !== currentPage) {
        svg.setAttribute("stroke", "#fa9500");
        el.querySelector("span").classList.remove("text-[#eb6424]");
      }
      svg.style.transform = "scale(1)";
    });
  });

  return nav;
}
