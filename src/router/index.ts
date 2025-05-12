import {createRouter, createWebHistory} from "vue-router";
import IndexPage from "../pages/indexPage.vue";
import IndexLayout from "../layouts/IndexLayout.vue";
import LoginPage from "../pages/LoginPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Home",
            component: IndexLayout,
            children: [
                {
                    path: "",
                    name: "Index",
                    component: IndexPage
                },
                {
                    path: "login",
                    name: "Login",
                    component: LoginPage
                },
                {
                    path: "register",
                    name: "Register",
                    component: RegisterPage
                }
            ]
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: NotFoundPage
        }
    ]
})

