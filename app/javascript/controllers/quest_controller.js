import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  // toggleTasks(event) {
  //   event.preventDefault()
  //   const tasksDiv = this.element.querySelector(`#tasks_${this.element.dataset.questId}`)
  //   tasksDiv.style.display = tasksDiv.style.display === "none" ? "block" : "none"
  // }

  static targets = ["form"];

  enableForm() {
    const inputs = this.formTarget.querySelectorAll("input, textarea, select");
    inputs.forEach(input => {
      input.disabled = false;
    });

    // Optionally, you can change the button to "Save" or show other actions
    const editButton = this.formTarget.querySelector("button");
    editButton.textContent = "Save";
    editButton.setAttribute("type", "submit");
  }
}
