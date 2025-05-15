<script setup lang="ts">

import useToggleTheme from "../composables/useToggleTheme.ts";
import Button from "./UI/form/Button.vue";
import {useRoute, useRouter} from "vue-router";
import {Moon, Sun} from 'lucide-vue-next'
import {computed, inject, onMounted, ref, watch} from "vue";
import type {VueCookies} from "vue-cookies";

const route = useRoute()
const cookie = inject<VueCookies>('$cookies')
const router = useRouter()
const {isDark, toggleTheme} = useToggleTheme()

const handleLogout = () => {
  cookie?.remove('token')
  isAuth.value = false
  router.replace('/login')
}

const isLoginPage = computed(() => {
  return route.path === '/login'
})
const isRegisterPage = computed(() => {
  return route.path === '/register'
})

const isAuth = ref<boolean>(false)

onMounted(
    () => {
      const token = cookie?.get('token')
      if (token) {
        isAuth.value = true
      } else {
        isAuth.value = false
      }
    }
)

watch(
    () => route.path,
    () => {
      const token = cookie?.get('token')
      if (token) {
        isAuth.value = true
      } else {
        isAuth.value = false
      }

    }
)

</script>


<template>
  <header
      class="flex z-10 fixed w-screen top-0 p-5 justify-between text-black bg-secondary dark:bg-primary dark:text-white ">
    <div class="logo">
      <h1 class="text-3xl text-black dark:text-white font-bold">ETime</h1>
    </div>
    <nav class="flex items-center gap-5">
      <Button theme="base" class="p-3 rounded-full" type="button" @click="toggleTheme">
        <Sun v-if="isDark" class="w-6 h-6"/>
        <Moon v-else class="w-6 h-6"/>
      </Button>
      <Button v-if="isAuth" @click="handleLogout" theme="primary" class="px-5 duration-300 py-2 rounded-xl"
              type="button">
        Log Out
      </Button>
      <router-link to="/login" v-if="!isLoginPage && !isAuth">
        <Button theme="primary" class="px-5 duration-300 py-2 rounded-xl" type="button">
          Login
        </Button>
      </router-link>
      <router-link to="/register" v-if="!isRegisterPage && !isAuth">
        <Button theme="secondary" class="px-5 duration-300 py-2 rounded-xl" type="button">
          Register
        </Button>
      </router-link>
    </nav>
  </header>
</template>