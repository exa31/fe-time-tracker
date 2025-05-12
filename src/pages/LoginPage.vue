<script setup lang="ts">
import {ref} from 'vue'
import {Lock, Mail} from 'lucide-vue-next'
import Input from "../components/UI/form/Input.vue";
import useAuth from "../composables/useAuth.ts";
import Button from "../components/UI/form/Button.vue";

const email = ref('')
const password = ref('')
const {login, errorMessages} = useAuth()

const handleLogin = async (): Promise<void> => {
  await login(email.value, password.value)
}
</script>


<template>
  <div class=" h-full px-3 flex-1 flex items-center justify-center">
    <div
        class=" max-w-lg w-full bg-white dark:bg-black   rounded-xl shadow-lg dark:shadow-gray-700 p-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input label="Email" v-model="email" :error="errorMessages.email" theme="base" class="p-3 mt-5 mb-3  rounded-xl"
               id="email" type="email"
               placeholder="test@gmail.com">
          <template #icon>
            <Mail class="text-center"/>
          </template>
        </Input>
        <Input label="Password" v-model="password" :error="errorMessages.password" theme="base"
               class="mt-5 mb-3 p-3 rounded-xl" id="password" type="password"
               placeholder="xxxxxxxxxx">
          <template #icon>
            <Lock class="text-center"/>
          </template>
        </Input>
        <Button type="submit" theme="primary" class="px-5 duration-300 py-2 rounded-xl w-full ">
          Login
        </Button>
      </form>
    </div>
  </div>
</template>

