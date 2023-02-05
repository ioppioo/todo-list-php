import { createApp } from 'vue'
import './css/style-notes.css'
import './css/style-board-list.css'
import './css/style-auth.css'
import App from './App.vue'
import {router} from "./router.js";

createApp(App).use(router).mount('#app')
