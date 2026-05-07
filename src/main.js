import { createApp } from "vue"; // fungsi pembuat aplikasi Vue
import App from "./App.vue"; // komponen root (induk semua komponen)
import "./style.css"; // CSS global (termasuk Tailwind)

createApp(App).mount("#app");
