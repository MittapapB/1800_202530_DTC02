class s extends HTMLElement{constructor(){super(),this.render(),this.attachEvents(),this.onConfirm=null}render(){this.innerHTML=`
      <div id="data-modal" class="fixed inset-0 bg-black/50 items-center justify-center z-50 hidden">
        <div class="bg-background-main rounded-xl shadow-lg w-100 max-w-[90%] p-5">
          <h2 id="data-title" class="text-base font-semibold text-title mb-6">Confirm</h2>

          <div class="flex justify-end gap-3">
            <button
              id = "data-cancel"
              class="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              id = "data-confirm"
              class="px-4 py-2 text-sm rounded-md bg-[#eb6424] text-white/90 hover:cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    `,this.modal=this.querySelector("#data-modal"),this.titleMessage=this.querySelector("#data-title"),this.cancelBtn=this.querySelector("#data-cancel"),this.confirmBtn=this.querySelector("#data-confirm")}attachEvents(){this.cancelBtn.addEventListener("click",()=>{this.close()}),this.confirmBtn.addEventListener("click",()=>{this.onConfirm(),this.close()}),this.modal.addEventListener("click",t=>{t.target===this.modal&&this.close()})}open(t,e,i){this.titleMessage.innerHTML=e||"Are you sure?",this.onConfirm=i,this.confirmBtn.innerHTML=t,this.modal.classList.remove("hidden"),this.modal.classList.add("flex")}close(){this.modal.classList.add("hidden")}}customElements.define("confirm-modal",s);
