// app/javascript/controllers/application.js
import { Application } from "@hotwired/stimulus"
import { eagerLoadControllersFrom } from "@hotwired/stimulus-loading";
import ModalController from "./modal_controller";
import SidebarController from "./sidebar_controller";
import DropdownController from "./dropdown_controller";

const application = Application.start()
eagerLoadControllersFrom("controllers", application);
application.register("modal", ModalController);
application.register("sidebar", SidebarController);
application.register("dropdown", DropdownController);

// Configure Stimulus development experience
application.debug = false
window.Stimulus = application

export { application }
