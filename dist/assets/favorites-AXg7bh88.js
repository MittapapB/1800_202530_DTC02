import{o as g,a as p,b as f,d as c,n as w,c as x,g as h,i as b}from"./firebaseConfig-BGUxOqTk.js";/* empty css              */import{N as y}from"./Navbar-CLB9A0dp.js";import"./confirm-modal-Djzis-F8.js";document.getElementById("navbar").appendChild(y());const d=document.getElementById("favorites-list");let l={};g(p,async e=>{if(!e){window.location.href="./sign-in.html";return}await u(e.uid),d.addEventListener("click",async t=>{t.preventDefault();const s=t.target.closest(".restaurant-card");if(!s)return;const a=s.dataset.id;if(!a)return;if(t.target.closest(".delete-btn")){await I(e.uid,a);return}sessionStorage.setItem("lastPage",window.location.pathname),window.location.href=`/src/pages/restaurant-info.html?restaurant-id=${encodeURIComponent(a)}`})});async function I(e,t){const s=document.getElementById("confirm-modal"),a=l[t];s.open("Remove",`Remove ${a.restaurantName} from your favorites?`,async()=>{const o=a.favoriteId,i=f(c,"users",e,"favorite_list",o);await w(i),await u(e)})}function D({id:e,name:t,address:s,image_url:a,avg_wait_time:o}){const i=a||"/images/MealWaveLogo.png",n=o>=0?`${o.toFixed(1)} min`:"—";return`
    <div class="w-full">
      <div data-id="${e}" class="restaurant-card bg-background-table rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition mb-4">
        <img
          src="${i}"
          alt="${t||"Restaurant"}"
          class="w-full h-32 object-cover rounded-t-lg"
        />

        <div class="flex flex-col p-4 min-h-fit">
          <div class="flex flex-row justify-between">
            <div>
              <span class="font-bold sm:text-lg text-md text-title">${t||"Restaurant"}</span>
              <p class="text-secondary text-sm text-gray-900">${s||"No address available"}</p>
            </div>
            <button
              type="button"
              class="delete-btn text-[#fa9500] hover:text-[#eb6424] hover:cursor-pointer"
            >
              <i class="fa-solid fa-trash text-lg"></i>
            </button>
          </div>
          <span class="text-green-dark mt-1">Avg Wait: ${n}</span>
        </div>
      </div>
    </div>
    `}async function u(e){try{d.innerHTML="",l={};const t=x(c,"users",e,"favorite_list"),s=await h(t);if(s.empty){d.innerHTML=`
      <div
        class="max-w-2xl w-9/12 mx-auto my-20 p-4 bg-backgroud-card rounded-2xl shadow-md"
      >
        <p class='text-gray-500 text-center'>You don't have any favorites yet.</p>
      </div>
    `;return}const a=[];for(let o of s.docs){const n=o.data().restaurant_id,v=o.id,m=f(c,"restaurant",n),r=(await b(m)).data();l[n]={favoriteId:v,restaurantName:r.name},a.push(D({id:n,name:r.name,address:r.address,image_url:r.image_url,avg_wait_time:r.avg_wait_time}))}d.innerHTML=a.join("")}catch(t){console.error(t)}}
