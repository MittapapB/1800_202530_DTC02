function o({target:t="main.html"}){const e=document.createElement("button");return e.className=`
    fixed top-3 left-4 md:left-8 lg:left-12 w-10 h-10 flex items-center justify-center
    rounded-full bg-[#FEF3E2] text-[#EB6424] text-lg md:text-xl
    shadow border border-black/10 transition-colors duration-200
    hover:cursor-pointer
  `,e.innerHTML=`
  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
`,e.addEventListener("click",()=>{window.location.href=t}),e.addEventListener("mouseenter",()=>{e.style.backgroundColor="#EB6424",e.style.color="#FEF3E2"}),e.addEventListener("mouseleave",()=>{e.style.backgroundColor="#FEF3E2",e.style.color="#EB6424"}),e}export{o as B};
