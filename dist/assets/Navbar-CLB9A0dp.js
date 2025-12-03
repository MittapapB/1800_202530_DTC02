function r(){const a=document.createElement("nav");a.innerHTML=`
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
`,a.querySelector('[data-page="home"]').addEventListener("click",()=>window.location.href="./main.html"),a.querySelector('[data-page="favorites"]').addEventListener("click",()=>window.location.href="./favorites.html"),a.querySelector('[data-page="profile"]').addEventListener("click",()=>window.location.href="./profile.html");const o=window.location.pathname;let s="";return o.includes("main.html")?s="home":o.includes("favorites.html")?s="favorites":o.includes("profile.html")&&(s="profile"),a.querySelectorAll(".nav-item").forEach(e=>{const t=e.querySelector("svg");e.dataset.page===s?(t.setAttribute("fill","#eb6424"),t.setAttribute("stroke","#FAF3E2"),e.querySelector("span").classList.add("text-[#eb6424]")):(t.setAttribute("fill","none"),t.setAttribute("stroke","#fa9500")),e.addEventListener("mouseenter",()=>{e.dataset.page!==s&&(t.setAttribute("stroke","#eb6424"),e.querySelector("span").classList.add("text-[#eb6424]")),t.style.transform="scale(1.1)"}),e.addEventListener("mouseleave",()=>{e.dataset.page!==s&&(t.setAttribute("stroke","#fa9500"),e.querySelector("span").classList.remove("text-[#eb6424]")),t.style.transform="scale(1)"})}),a}export{r as N};
