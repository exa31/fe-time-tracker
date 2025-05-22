<script setup lang="ts">
import {ref} from 'vue'
import Input from "../components/UI/form/Input.vue";
import {Lock, Mail, User} from "lucide-vue-next";
import Button from "../components/UI/form/Button.vue";
import useAuth from "../composables/useAuth.ts";

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const name = ref('')

const {register, errorMessages} = useAuth()

const handleLogin = async () => {
  await register(name.value, email.value, password.value, confirmPassword.value)
}
</script>


<template>
  <div class=" h-full px-3 flex-1 flex items-center justify-center">
    <div
        class=" max-w-lg w-full bg-white duration-300 transition-all dark:bg-black   rounded-xl shadow-lg dark:shadow-gray-700 p-8 space-y-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <Input label="Full Name" v-model="name" :error="errorMessages.name" theme="base"
               class="p-3 mt-5 mb-3  rounded-xl"
               id="name" type="text"
               placeholder="test name">
          <template #icon>
            <User class="text-center"/>
          </template>
        </Input>
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
        <Input label="Confirm Password" v-model="confirmPassword" :error="errorMessages.confirmPassword" theme="base"
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

<style scoped>

</style>