import {createApp} from 'vue'
import './app.css'
import App from './App.vue'
import Vue3Toastify from "vue3-toastify";
import VueCookies from 'vue-cookies';
import 'vue3-toastify/dist/index.css';
import {router} from './router'

createApp(App)
    .use(router)
    .use(Vue3Toastify)
    .use(VueCookies, {
        expires: '1d',
        path: '/',
        secure: true,
        sameSite: 'same',
        domain: 'localhost',
        httpOnly: false,
        maxAge: 60 * 60 * 24,
    })
    .mount('#app')
