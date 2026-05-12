import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import "./style.css";

async function bootstrap() {
  if (import.meta.env.VITE_MOCK_API === "true") {
    const { worker } = await import("./mocks/browser.js");
    await worker.start({
      onUnhandledRequest: "bypass",
      serviceWorker: { url: "/mockServiceWorker.js" },
    });
    console.info("[MSW] Mock API aktif — semua request ke /api dicegat.");
  }

  createApp(App).use(router).mount("#app");
}

bootstrap();
