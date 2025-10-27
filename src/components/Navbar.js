// src/components/Navbar.js
export function Navbar() {
  const nav = document.createElement("nav");

  nav.innerHTML = `
    <div class="flex fixed w-full bottom-0 justify-between text-2xl bg-[#FEF3E2] p-3">
      <div class="flex flex-col items-center justify-center gap-0 text-[#eb6424] p-1 mx-3 rounded-2xl hover:bg-[#eb6424] hover:text-[#FEF3E2]" data-page="home">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
          <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
          <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
        </svg>
        Home
      </div>

      <div class="flex flex-col items-center justify-center gap-0 text-[#eb6424] p-1 mx-3 rounded-2xl hover:bg-[#eb6424] hover:text-[#FEF3E2]" data-page="favorites">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
        Favorites
      </div>

      <div class="flex flex-col items-center justify-center gap-0 text-[#eb6424] p-1 mx-3 rounded-2xl hover:bg-[#eb6424] hover:text-[#FEF3E2]" data-page="profile">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
        </svg>
        Profile
      </div>
    </div>
  `;

  nav
    .querySelector('[data-page="home"]')
    .addEventListener("click", () => (window.location.href = "/index.html"));
  nav
    .querySelector('[data-page="favorites"]')
    .addEventListener(
      "click",
      () => (window.location.href = "/favorites.html")
    );
  nav
    .querySelector('[data-page="profile"]')
    .addEventListener(
      "click",
      () => (window.location.href = "/src/pages/profile.html")
    );

  const path = window.location.pathname;
  if (path.includes("index.html") || path === "/") {
    nav
      .querySelector('[data-page="home"]')
      .classList.add("bg-[#eb6424]", "text-[#FEF3E2]");
  } else if (path.includes("favorites.html")) {
    nav
      .querySelector('[data-page="favorites"]')
      .classList.add("bg-[#eb6424]", "text-[#FEF3E2]");
  } else if (path.includes("profile.html")) {
    nav
      .querySelector('[data-page="profile"]')
      .classList.add("bg-[#eb6424]", "text-[#FEF3E2]");
  }

  return nav;
}
