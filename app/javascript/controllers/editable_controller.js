import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["text"]

  edit(event) {
    event.preventDefault();
    
    const Type = this.element.dataset.type;
    let updateUrl;

    if (Type !== 'task') {
      const questId = this.element.dataset.questId;
      updateUrl = `/quests/${questId}`;
    } else {
      const taskId = this.element.dataset.taskId;
      updateUrl = `/quests/${this.element.closest('[data-controller="editable"]').dataset.questId}/tasks/${taskId}`;
    }
  
    this.textTarget.contentEditable = "true";
    this.textTarget.focus();
  
    this.textTarget.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        let bodyContent;
        if (Type !== 'task') {
          bodyContent = JSON.stringify({
            quest: {
              title: this.textTarget.textContent
            }
          });
        }else {
          bodyContent = JSON.stringify({
            task: {
              task: this.textTarget.textContent
            }
          });
        }
        e.preventDefault();
        fetch(updateUrl, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content
          },
          body: bodyContent
        })
        .then(response => response.text())
        .then(html => {
          this.element.outerHTML = html;
        })
        .catch(error => console.error("Error:", error));
      }
    });
  }
}
