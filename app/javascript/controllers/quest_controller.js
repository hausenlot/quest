import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["checkbox"];

  toggleCompleted(event) {
    const questId = this.element.dataset.questId;
    const isCompleted = event.target.checked;

    // Send a patch request to update the completed status
    fetch(`/quests/${questId}/toggle_status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({ completed: isCompleted })
    }).then(response => {
      if (!response.ok) {
        console.error("Error updating quest status");
      }
    });
  }
}
