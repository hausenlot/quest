import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["checkbox"];

  toggleCompleted(event) {
    const questId = this.element.dataset.questId;
    const taskId = this.element.dataset.taskId;
    const isCompleted = event.target.checked;

    // Send a patch request to update the completed status
    fetch(`/quests/${questId}/tasks/${taskId}/toggle_status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ status: isCompleted })
    })
    .then(response => {
      if (!response.ok) {
        console.error("Error updating task status");
      }
    })
    .catch(error => {
      console.error("Fetch error:", error);
    });
  }
}
