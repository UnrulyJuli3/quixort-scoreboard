import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import "./style.scss";
import App from "./App.vue";
import Scoreboard from "./components/Scoreboard.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: Scoreboard
        },
        {
            name: "artifact",
            path: "/artifact/:artifactId",
            component: Scoreboard
        }
    ]
});

const app = createApp(App);
app.use(router);
app.mount("#app");