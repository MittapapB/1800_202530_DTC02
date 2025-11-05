// src/components/BackButton.js
export function BackButton({ target = "main.html" }) {
  const btn = document.createElement("button");

  btn.className = `
    fixed top-4 left-4 md:left-8 lg:left-12 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center
    rounded-full bg-[#FEF3E2] text-[#EB6424] text-lg md:text-xl
    shadow border border-black/10 transition-colors duration-200
    hover:cursor-pointer
  `;

  btn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
`;

  btn.addEventListener("click", () => {
    window.location.href = target;
  });

  btn.addEventListener("mouseenter", () => {
    btn.style.backgroundColor = "#EB6424";
    btn.style.color = "#FEF3E2";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.backgroundColor = "#FEF3E2";
    btn.style.color = "#EB6424";
  });

  return btn;
}
