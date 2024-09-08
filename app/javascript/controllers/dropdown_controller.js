import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu", "button"];

  connect() {
    // Optionally, if there's any initialization needed
  }

  toggleDropdown(event) {
    this.menuTarget.classList.toggle("hidden");
  }

  selectItem(event) {
    const listId = event.currentTarget.dataset.listId;
    const listName = event.currentTarget.dataset.listName;

    // Update the hidden field with the selected list_id
    document.getElementById("list_id_field").value = listId;

    // Update the button text to show the selected list name
    this.buttonTarget.innerHTML = `
      ${listName}
      <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>
    `;

    // Close the dropdown
    this.menuTarget.classList.add("hidden");
  }
}
