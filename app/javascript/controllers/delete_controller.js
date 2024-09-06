import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  async confirm(event) {
    // Prevent the default link behavior
    event.preventDefault();

    // Confirm deletion
    if (confirm("Are you sure you want to delete this quest?")) {
      try {
        // Perform the delete request
        const response = await fetch(this.element.href, {
          method: "DELETE",
          headers: {
            "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").content,
            "Accept": "text/vnd.turbo-stream.html"
          }
        });

        // Check if the response is successful
        if (response.ok) {
          // Close the sidebar after successful deletion
          this.closeSidebar();
          
          // Process the Turbo Stream response
          const turboStream = await response.text();
          Turbo.renderStreamMessage(turboStream);
        } else {
          console.error("Failed to delete the quest");
        }
      } catch (error) {
        console.error("Error occurred during deletion:", error);
      }
    }
  }

  closeSidebar() {
    // Implement the logic to close the sidebar
    this.element.closest("[data-sidebar-target='sidebar']").classList.add("translate-x-full");
  }
}
