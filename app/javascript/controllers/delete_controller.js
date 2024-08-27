import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["link"]

  confirm(event) {
    if (!confirm("Are you sure you want to delete this quest?")) {
      event.preventDefault()
    }
  }
}
