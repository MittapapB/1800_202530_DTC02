class ConfirmModal extends HTMLElement {
  constructor() {
    super();
    this.render(); // Build the modal HTML
    this.attachEvents(); // Attach button and overlay events
    this.onConfirm = null; // Callback to run when user confirms
  }

  // Render modal structure
  render() {
    this.innerHTML = `
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
    `;

    // Store value for using later
    this.modal = this.querySelector("#data-modal");
    this.titleMessage = this.querySelector("#data-title");
    this.cancelBtn = this.querySelector("#data-cancel");
    this.confirmBtn = this.querySelector("#data-confirm");
  }

  attachEvents() {
    // Cancel button closes modal
    this.cancelBtn.addEventListener("click", () => {
      this.close();
    });

    // Confirm button triggers callback for confirmation then closes modal
    this.confirmBtn.addEventListener("click", () => {
      this.onConfirm();
      this.close();
    });

    // Clicking outside the modal closes it
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
  }

  // Open the modal with custom label and title
  open(confirmMessage, title, onConfirm) {
    this.titleMessage.innerHTML = title || "Are you sure?";
    this.onConfirm = onConfirm;
    this.confirmBtn.innerHTML = confirmMessage;
    this.modal.classList.remove("hidden");
    this.modal.classList.add("flex");
  }

  // Hide the modal
  close() {
    this.modal.classList.add("hidden");
  }
}

// Define custom element so it can be used in HTML
customElements.define("confirm-modal", ConfirmModal);
