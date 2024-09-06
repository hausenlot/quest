import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["modalTitle", "modalBody"];

  showLoginForm() {
    this.modalTitleTarget.innerText = "Log In";

    fetch("/quests/render_login_form")
      .then(response => response.text())
      .then(html => {
        this.modalBodyTarget.innerHTML = html;
      })
      .catch(error => console.error('Error:', error));
  }

  showRegistrationForm() {
    this.modalTitleTarget.innerText = "Sign Up";

    fetch("/quests/render_registration_form")
      .then(response => response.text())
      .then(html => {
        this.modalBodyTarget.innerHTML = html;
      })
      .catch(error => console.error('Error:', error));
  }
}
