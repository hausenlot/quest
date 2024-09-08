import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["sidebar"]

  connect() {
    console.log("Sidebar controller connected");
  }

  toggleSidebar(event) {
    const questId = event.currentTarget.dataset.questId
    this.openSidebar()
    this.loadQuestDetails(questId)
  }

  openSidebar() {
    this.sidebarTarget.classList.remove('translate-x-full')
  }

  closeSidebar() {
    this.sidebarTarget.classList.add('translate-x-full')
  }

  async loadQuestDetails(questId) {
    const response = await fetch(`/quests/${questId}/details`, {
      headers: {
        "Accept": "text/vnd.turbo-stream.html"
      }
    })
  
    if (response.ok) {
      const text = await response.text()
  
      // Create a temporary container to parse the Turbo Stream response
      const parser = new DOMParser()
      const doc = parser.parseFromString(text, 'text/html')
      
      // Find the turbo-stream element and extract its content
      const turboStreamElement = doc.querySelector('turbo-stream')
      if (turboStreamElement) {
        const action = turboStreamElement.getAttribute('action')
        const targetId = turboStreamElement.getAttribute('target')
        const templateContent = turboStreamElement.querySelector('template').innerHTML
        
        // Check if the target matches
        if (targetId === 'sidebar-content') {
          const contentContainer = this.element.querySelector('[data-sidebar-target="content"]')
          if (contentContainer) {
            contentContainer.innerHTML = templateContent
          } else {
            console.error('Content container not found.')
          }
        }
      } else {
        console.error('No turbo-stream element found in response.')
      }
    } else {
      console.error('Failed to load quest details.')
    }
  }
}
