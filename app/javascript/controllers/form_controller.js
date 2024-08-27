import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form"]

  connect() {
    console.log("Form controller connected")
  }

  async submit(event) {
    event.preventDefault()
    const form = this.formTarget
    const response = await fetch(form.action, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: new FormData(form)
    })

    const data = await response.text()
    // Handle response (optional)
  }
}
