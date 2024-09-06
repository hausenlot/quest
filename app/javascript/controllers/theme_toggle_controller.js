import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["darkIcon", "lightIcon"];

  connect() {
    // On page load or when changing themes
    const theme = localStorage.getItem('color-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark'); // Apply dark theme to body
      this.darkIconTarget.classList.remove('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark'); // Remove dark theme from body
      this.lightIconTarget.classList.remove('hidden');
    }
  }

  toggle() {
    // Toggle icons inside button
    this.darkIconTarget.classList.toggle('hidden');
    this.lightIconTarget.classList.toggle('hidden');

    // Toggle theme
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark'); // Apply dark theme to body
        localStorage.setItem('color-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark'); // Remove dark theme from body
        localStorage.setItem('color-theme', 'light');
      }
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark'); // Remove dark theme from body
        localStorage.setItem('color-theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark'); // Apply dark theme to body
        localStorage.setItem('color-theme', 'dark');
      }
    }
  }
}
