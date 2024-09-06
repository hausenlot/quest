import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu"];

  connect() {
    this.hideMenu();
  }

  toggleDropdown() {
    if (this.menuTarget.classList.contains("hidden")) {
      this.showMenu();
    } else {
      this.hideMenu();
    }
  }

  showMenu() {
    this.menuTarget.classList.remove("hidden");
  }

  hideMenu() {
    this.menuTarget.classList.add("hidden");
  }
}
