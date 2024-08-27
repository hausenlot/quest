import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  toggleTasks(event) {
    event.preventDefault()
    const tasksDiv = this.element.querySelector(`#tasks_${this.element.dataset.questId}`)
    tasksDiv.style.display = tasksDiv.style.display === "none" ? "block" : "none"
  }
}
