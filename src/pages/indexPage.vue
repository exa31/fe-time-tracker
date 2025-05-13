<script setup lang="ts">
import useTimeSession from "../composables/useTimeSession.ts";
import {onMounted, ref} from "vue";

const {timeSessionActive, getActiveTimeSession, startTimeSession, stopTimeSession} = useTimeSession();

onMounted(() => {
  getActiveTimeSession();
});

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

setInterval(updateFormattedTime, 1000);

</script>

<template>
  <div class="text-center space-y-4">
    <div class="flex gap-10">
      <div class="time-box">
        <transition name="fade">
          <div :key="day" class="text-5xl time-display text-black dark:text-white font-bold">
            {{ day }}
          </div>
        </transition>
      </div>
      <p class="text-5xl text-black dark:text-white font-bold">:</p>
      <div class="time-box">
        <transition name="fade">
          <div :key="hour" class="text-5xl time-display text-black dark:text-white font-bold">
            {{ hour }}
          </div>
        </transition>
      </div>
      <p class="text-5xl text-black dark:text-white font-bold">:</p>
      <div class="time-box">
        <transition name="fade">
          <div :key="minute" class="text-5xl time-display text-black dark:text-white font-bold">
            {{ minute }}
          </div>
        </transition>
      </div>
      <p class="text-5xl text-black dark:text-white font-bold">:</p>
      <div class="time-box">
        <transition name="fade">

          <div :key="second" class="text-5xl time-display text-black dark:text-white font-bold">
            {{ second }}
          </div>
        </transition>
      </div>
    </div>
    <div class="space-x-2">
      <button @click="startTimeSession" class="btn">Start</button>
      <button @click="stopTimeSession" class="btn">Stop</button>
    </div>
  </div>
</template>

<style scoped>
.time-box {
  position: relative;
  width: 4rem; /* tetap agar tidak goyang */
  height: 10rem;
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
