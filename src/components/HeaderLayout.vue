<script setup lang="ts">

import useToggleTheme from "../composables/useToggleTheme.ts";
import Button from "./UI/form/Button.vue";
import {useRoute} from "vue-router";
import {Moon, Sun} from 'lucide-vue-next'
import {computed, inject} from "vue";
import type {VueCookies} from "vue-cookies";

const route = useRoute()
const cookie = inject<VueCookies>('$cookies')
const {isDark, toggleTheme} = useToggleTheme()

const isLoginPage = computed(() => {
  return route.path === '/login'
})
const isRegisterPage = computed(() => {
  return route.path === '/register'
})

const isAuth = computed(() => {
  return cookie?.isKey('token')
})

console.log(isAuth.value)

</script>


<template>
  <header
      class="flex p-5 justify-between text-black bg-secondary dark:bg-primary dark:text-white ">
    <div class="logo">
      <h1 class="text-3xl text-black dark:text-white font-bold">ETime</h1>
    </div>
    <nav class="flex items-center gap-5">
      <Button theme="base" class="p-3 rounded-full" type="button" @click="toggleTheme">
        <Sun v-if="isDark" class="w-6 h-6"/>
        <Moon v-else class="w-6 h-6"/>
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