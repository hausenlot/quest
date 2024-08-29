import { Application } from "@hotwired/stimulus"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading";

const application = Application.start()
eagerLoadControllersFrom("controllers", application);
// Configure Stimulus development experience
application.debug = false
window.Stimulus   = application

export { application }
