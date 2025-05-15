<script setup lang="ts">
import useTimeSession from "../composables/useTimeSession.ts";
import {onBeforeMount, onMounted, ref} from "vue";
import Button from "../components/UI/form/Button.vue";

const {
  timeSessionActive,
  getAllTimeSession,
  data,
  getActiveTimeSession,
  loading,
  startTimeSession,
  stopTimeSession
} = useTimeSession();

onMounted(async () => {
  getAllTimeSession()
  await getActiveTimeSession();
  if (timeSessionActive?.startTime) {
    interval.value = setInterval(updateFormattedTime, 1000)
  }
});

const interval = ref<Number | null>(null);
const formattedTime = ref("00:00:00:00");
const hour = ref("00");
const minute = ref("00");
const second = ref("00");
const day = ref("00");

const updateFormattedTime = () => {
  if (timeSessionActive?.startTime) {
    const start = new Date(timeSessionActive.startTime);
    const now = new Date();
    const elapsedTime = now.getTime() - start.getTime();

    const totalSeconds = Math.floor(elapsedTime / 1000);
    const totalMinutes = Math.floor(totalSeconds / 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    const remainingHours = totalHours % 24;
    const remainingMinutes = totalMinutes % 60;
    const remainingSeconds = totalSeconds % 60;

    hour.value = String(remainingHours).padStart(2, "0");
    minute.value = String(remainingMinutes).padStart(2, "0");
    second.value = String(remainingSeconds).padStart(2, "0");
    day.value = String(totalDays).padStart(2, "0");
    formattedTime.value = `${String(totalDays).padStart(2, "0")}:${String(remainingHours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }
};

const handleStop = async () => {
  try {
    await stopTimeSession();
    if (interval.value !== null) {
      clearInterval(interval.value as number);
      interval.value = null;
      hour.value = "00";
      minute.value = "00";
      second.value = "00";
      day.value = "00";
      formattedTime.value = "00:00:00:00";
    }
    Object.assign(timeSessionActive, {
      idUser: 0,
      idTimeSession: 0,
      startTime: 0,
      endTime: undefined,
      description: undefined,
      duration: undefined
    })
  } catch (error) {
    console.error("Error stopping time session:", error);
  }
};

const handleStart = async () => {
  try {
    await startTimeSession();
    if (interval.value === null) {
      interval.value = setInterval(updateFormattedTime, 1000);
    }
  } catch (error) {
    console.error("Error starting time session:", error);
  }
};

onBeforeMount(() => {
  if (interval.value !== null) {
    clearInterval(interval.value as number);
    interval.value = null;
  }
})


function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

function parseISODuration(duration: string): string {
  // Contoh: "PT1H12M14.576297S"
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.\d+)?S)?/
  const matches = duration.match(regex)

  if (!matches) return '00:00:00'

  const hours = matches[1] ? parseInt(matches[1]) : 0
  const minutes = matches[2] ? parseInt(matches[2]) : 0
  const seconds = matches[3] ? parseInt(matches[3]) : 0

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

</script>

<template>
  <div class="text-center space-y-4">
    <div class="min-h-screen  flex flex-col items-center justify-center">
      <div class="flex  items-center justify-center gap-10">
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="day" class="text-9xl time-display text-black dark:text-white font-bold">
              {{ day }}
            </div>
          </transition>
        </div>
        <p class="text-9xl text-black dark:text-white font-bold">:</p>
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="hour" class="text-9xl time-display text-black dark:text-white font-bold">
              {{ hour }}
            </div>
          </transition>
        </div>
        <p class="text-9xl text-black dark:text-white font-bold">:</p>
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="minute" class="text-9xl time-display text-black dark:text-white font-bold">
              {{ minute }}
            </div>
          </transition>
        </div>
        <p class="text-9xl text-black dark:text-white font-bold">:</p>
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="second" class="text-9xl time-display text-black dark:text-white font-bold">
              {{ second }}
            </div>
          </transition>
        </div>
      </div>
      <div class="my-20">
        <template v-if="!loading">
          <Button v-if="timeSessionActive.startTime" type="button" theme="primary"
                  class="px-14 duration-300 py-2 rounded-xl"
                  @click="handleStop">
            Stop
          </Button>
          <Button type="button" v-else theme="primary" class="px-14 duration-300 py-2 rounded-xl" @click="handleStart">
            Start
          </Button>
        </template>
        <template v-else>
          <div class="inline-block h-10 w-24 rounded-xl bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        </template>
      </div>
    </div>

    <div class="my-20">
      <h3 class="text-2xl text-black dark:text-white font-bold">History</h3>
      <p class="text-gray-500 dark:text-gray-400">History of your time session</p>
      <table class="min-w-full table-auto border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead class="bg-gray-100 text-center  dark:bg-gray-800 text-gray-700 dark:text-gray-200">
        <tr>
          <th class="px-4 py-2 text-black dark:text-white ">Start Time</th>
          <th class="px-4 py-2 text-black dark:text-white ">End Time</th>
          <th class="px-4 py-2 text-black dark:text-white ">Duration</th>
          <th class="px-4 py-2 text-black dark:text-white ">Description</th>
          <th class="px-4 py-2 text-black dark:text-white ">Action</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in data"
            :key="index"
            class="even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <td class="text-black dark:text-white px-4 py-2">
            {{ formatDate(item.startTime) }}
          </td>
          <td class="text-black dark:text-white px-4 py-2">
            {{ item.endTime ? formatDate(item.endTime) : '-' }}
          </td>
          <td class="text-black dark:text-white px-4 py-2">
            {{ item.duration ? parseISODuration(item.duration) : '-' }}
          </td>
          <td class="text-black dark:text-white px-4 py-2">
            {{ item.description ? item.description : '-' }}
          </td>
          <td class="text-black dark:text-white px-4 py-2">
            <Button theme="secondary" class="px-5 duration-300 py-2 rounded-xl" type="button">
              Edit
            </Button>
          </td>
        </tr>
        </tbody>
      </table>

    </div>
  </div>
</template>

<style scoped>
.time-box {
  position: relative;
  width: 10rem; /* tetap agar tidak goyang */
  height: 8rem;
  display: inline-block;
}

.time-display {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>
