import{g as l,c as m,d as u,o as h,a as g}from"./firebaseConfig-BGUxOqTk.js";/* empty css              */import{N as p}from"./Navbar-CLB9A0dp.js";import{o as x}from"./authentication-CA3jcVaF.js";document.getElementById("navbar").appendChild(p());const i=document.getElementById("searchInput"),a=document.getElementById("suggestions");let c=[];async function v(){try{const e=await l(m(u,"restaurant"));c=[],e.forEach(t=>{const n=t.data();n?.name&&t.id&&c.push({id:t.id,name:n.name.trim()})})}catch(e){console.error("Failed to load restaurant names:",e)}}function w(e){if(a.innerHTML="",!e.length){a.classList.add("hidden");return}e.forEach(t=>{const n=document.createElement("div");n.className="autocomplete-suggestion px-4 py-2 cursor-pointer hover:bg-[#eb6424] hover:text-[#fff8f0]",n.textContent=t.name,n.addEventListener("click",()=>{y(t.id)}),a.appendChild(n)}),a.classList.remove("hidden")}function y(e){const t=`/src/pages/restaurant-info.html?restaurant-id=${encodeURIComponent(e)}`;window.location.href=t}i.addEventListener("input",()=>{const e=(i.value||"").toLowerCase().trim();if(!e){a.innerHTML="",a.classList.add("hidden");return}const t=c.filter(n=>n.name.toLowerCase().includes(e));w(t.slice(0,5))});document.addEventListener("click",e=>{e.target!==i&&!a.contains(e.target)&&(a.innerHTML="",a.classList.add("hidden"))});v();function E(){const e=document.getElementById("name-goes-here");x(t=>{if(!t){e.textContent="";return}const n=t.displayName||t.email;e&&(e.textContent=`, ${n}!`)})}function L(e){const t=[...e];for(let n=t.length-1;n>0;n--){const s=Math.floor(Math.random()*(n+1));[t[n],t[s]]=[t[s],t[n]]}return t.slice(0,6)}const b=document.getElementById("restaurant-grid");function R({id:e,name:t,address:n,image_url:s,avg_wait_time:r,index:d}){const o=s||"/images/MealWaveLogo.png",f=r>=0?`${r.toFixed(1)} min`:"—";return`
      <a href="${`./restaurant-info.html?restaurant-id=${encodeURIComponent(e)}`}" class="bg-background-table rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition w-[170px] sm:w-[200px] h-[250px]">

        <div class="w-full h-[110px] sm:h-[130px] overflow-hidden">
          <img
            src="${o}"
            alt="${t||"Restaurant"}"
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex flex-col p-4 justify-between flex-1 space-y-2">
          <div class="space-y-1">
            <span class="font-bold sm:text-lg md:text-md text-sm text-title">${t||"Restaurant"}</span>
            <p class="text-secondary text-sm mt-2 truncate text-gray-900">${n||"No address available"}</p>
          </div>
          <span class="text-secondary mt-1">Avg Wait: ${f}</span>
        </div>
      </a>
    `}async function C(){try{const e=m(u,"restaurant"),t=await l(e);if(t.empty)return;const n=[];let s=1;t.forEach(d=>{const o=d.data();n.push(R({id:d.id,name:o.name,address:o.address,image_url:o.image_url,avg_wait_time:o.avg_wait_time,index:s})),s+=1});const r=L(n);b.innerHTML=r.join("")}catch(e){console.error(e)}}const I=document.getElementById("addRestaurantBtn");I.addEventListener("click",e=>{e.preventDefault(),h(g,t=>{t?window.location.href="./add-restaurant.html":window.location.href="./sign-in.html"})});E();C();
