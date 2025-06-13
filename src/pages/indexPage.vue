<script setup lang="ts">
import useTimeSession from "../composables/useTimeSession.ts";
import {onBeforeMount, onMounted, ref} from "vue";
import Button from "../components/UI/form/Button.vue";
import Select from "../components/UI/form/Select.vue";
import Modal from "../components/UI/Modal.vue";
import {ClipboardList} from "lucide-vue-next";
import Input from "../components/UI/form/Input.vue";

const {
  timeSessionActive,
  getAllTimeSession,
  data,
  getActiveTimeSession,
  loading,
  startTimeSession,
  stopTimeSession,
  updateTimeSession,
  errorMessages
} = useTimeSession();

onMounted(async () => {
  getAllTimeSession()
  await getActiveTimeSession();
  if (timeSessionActive?.start_time) {
    interval.value = setInterval(updateFormattedTime, 1000)
  }
});

const interval = ref<Number | null>(null);
const formattedTime = ref("00:00:00:00");
const show = ref(false);
const formData = ref<
    {
      description: string
      idTimeSession?: number
    }>({
  description: '',
});
const selectedViewType = ref<{ value: string, text: string }>({
  value: "full-date",
  text: "Tanggal Lengkap"
});
const hour = ref("00");
const minute = ref("00");
const second = ref("00");
const day = ref("00");

const updateFormattedTime = () => {
  if (timeSessionActive?.start_time) {
    const start = new Date(timeSessionActive.start_time);
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

const optionsView: { text: string, value: string }[] = [
  {text: "Tanggal Lengkap", value: "full-date"},       // 11 Mei 2025, 16:32
  {text: "Tanggal Singkat", value: "short-date"},       // 11/05/2025, 16:32
  {text: "Hari Singkat + Tanggal", value: "short-day"}  // Sel, 11/05/2025, 16:32
];

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
    getAllTimeSession()
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
    getAllTimeSession()
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


function formatDate(timestamp: number, viewType: { value: string, text: string }): string | null {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return null; // Invalid date
  }

  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const shortDays = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNum = date.getDate();
  const monthNum = date.getMonth() + 1;
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();

  const dayName = days[date.getDay()];
  const shortDayName = shortDays[date.getDay()];

  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");

  let datePart = "";

  switch (viewType.value) {
    case "full-date":
      datePart = `${dayName}, ${dayNum} ${monthName} ${year}`;
      break;
    case "short-date":
      datePart = `${dayNum.toString().padStart(2, '0')}/${monthNum.toString().padStart(2, '0')}/${year}`;
      break;
    case "short-day":
      datePart = `${shortDayName}, ${dayNum.toString().padStart(2, '0')}/${monthNum.toString().padStart(2, '0')}/${year}`;
      break;
    default:
      datePart = date.toLocaleDateString();
  }

  return `${datePart}, ${hour}:${minute}:${second}`;
}

// function parseISODuration(duration: string): string {
//   // Jika hanya angka (misal: "29177319"), anggap sebagai detik
//   if (/^\d+$/.test(duration)) {
//     const totalSeconds = parseInt(duration, 10)
//
//     // Batasi agar jam tidak jadi 8104 (misalnya tampilkan sisa jam setelah hari)
//     const days = Math.floor(totalSeconds / 86400)
//     const remainingAfterDays = totalSeconds % 86400
//     const hours = Math.floor(remainingAfterDays / 3600)
//     const minutes = Math.floor((remainingAfterDays % 3600) / 60)
//     const seconds = remainingAfterDays % 60
//
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
//   }
//
//   // Jika format ISO 8601 (misal: "PT1H12M14.576297S")
//   const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:\.\d+)?S)?/
//   const matches = duration.match(regex)
//
//   if (!matches) return '00:00:00'
//
//   const hours = matches[1] ? parseInt(matches[1]) : 0
//   const minutes = matches[2] ? parseInt(matches[2]) : 0
//   const seconds = matches[3] ? parseInt(matches[3]) : 0
//
//   return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
// }

function handleDetail(idTimeSession: number) {
  show.value = true
  const timeSession = data.find((item) => item.id === idTimeSession)
  if (!timeSession) return
  formData.value = {
    description: timeSession.description || '',
    idTimeSession: idTimeSession,
  }
}

async function handleUpdate() {
  try {
    if (!formData.value?.idTimeSession || !formData.value?.description) return
    const timeSession = data.find((item) => item.id === formData.value?.idTimeSession)
    if (!timeSession) return
    const body = {
      description: formData.value.description,
    }
    await updateTimeSession(formData.value.idTimeSession, body)
    show.value = false
    getAllTimeSession()
  } catch (error) {
    console.error("Error updating time session:", error);
  }
}

</script>

<template>
  <div class="text-center w-full space-y-4">
    <div class="min-h-screen  flex flex-col items-center justify-center">
      <div class="flex items-center justify-center gap-4 md:gap-10">
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="day" class="lg:text-9xl text-4xl md:text-7xl time-display text-black dark:text-white font-bold">
              {{ day }}
            </div>
          </transition>
        </div>
        <p class="lg:text-9xl text-4xl md:text-7xl text-black dark:text-white font-bold">:</p>
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="hour" class="lg:text-9xl text-4xl md:text-7xl time-display text-black dark:text-white font-bold">
              {{ hour }}
            </div>
          </transition>
        </div>
        <p class="lg:text-9xl text-4xl md:text-7xl text-black dark:text-white font-bold">:</p>
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="minute"
                 class="lg:text-9xl text-4xl md:text-7xl time-display text-black dark:text-white font-bold">
              {{ minute }}
            </div>
          </transition>
        </div>
        <p class="lg:text-9xl text-4xl md:text-7xl text-black dark:text-white font-bold">:</p>
        <div class="time-box">
          <div v-if="loading">
            <div class="w-full h-full time-display bg-gray-300  dark:bg-gray-700 animate-pulse rounded-2xl"></div>
          </div>
          <transition v-else name="fade">
            <div :key="second"
                 class="lg:text-9xl text-4xl md:text-7xl time-display text-black dark:text-white font-bold">
              {{ second }}
            </div>
          </transition>
        </div>
      </div>
      <div class="my-20">
        <template v-if="!loading">
          <Button v-if="timeSessionActive.start_time" type="button" theme="primary"
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

    <div class="my-20 w-full mx-auto px-4">
      <h3 class="text-2xl text-black dark:text-white font-bold">History</h3>
      <p class="text-gray-500 dark:text-gray-400">History of your time session</p>
      <div class="text-start my-5">
        <Select theme="base" class="px-5 py-3 rounded-2xl" id="selectView" v-model="selectedViewType"
                label="Select view"
                :options="optionsView"
                placeholder="Select View History"></Select>
      </div>
      <div class="overflow-auto mt-10 rounded-lg border border-gray-300 dark:border-gray-700">
        <table class="min-w-max  w-full table-auto">
          <thead class="bg-gray-100 text-center dark:bg-gray-800 text-gray-700 dark:text-gray-200">
          <tr>
            <th class="px-4 py-2 text-black dark:text-white">Start Time</th>
            <th class="px-4 py-2 text-black dark:text-white">End Time</th>
            <th class="px-4 py-2 text-black dark:text-white">Duration</th>
            <th class="px-4 py-2 text-black dark:text-white">Description</th>
            <th class="px-4 py-2 text-black dark:text-white">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, index) in data"
              :key="index"
              class="even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <td class="text-black dark:text-white px-4 py-2">
              {{ formatDate(item.start_time, selectedViewType) }}
            </td>
            <td class="text-black dark:text-white px-4 py-2">
              {{ item.end_time ? formatDate(item.end_time, selectedViewType) : '-' }}
            </td>
            <td class="text-black dark:text-white px-4 py-2">
              {{ item.duration ? item.duration : '-' }}
            </td>
            <td class="text-black dark:text-white px-4 py-2">
              {{ item.description ? item.description : '-' }}
            </td>
            <td class="text-black dark:text-white px-4 py-2">
              <Button @click="handleDetail(item.id)" theme="secondary" class="px-5 duration-300 py-2 rounded-xl"
                      type="button">
                Edit
              </Button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>


    </div>
    <Modal :show="show" size="md" @close="show = false">
      <template #header>
        <h2 class="text-lg font-bold text-gray-800 dark:text-gray-200">Edit Time Session</h2>
      </template>
      <template #body>
        <form @submit.prevent="handleUpdate">
          <div class="text-start">
            <Input label="Description" :error="errorMessages.description" v-model="formData.description" theme="base"
                   class="p-3 mt-5 mb-3 rounded-xl"
                   id="description"
                   type="text" placeholder="Description">
              <template #icon>
                <ClipboardList class="text-center"/>
              </template>
            </Input>
          </div>
          <div class="flex justify-end gap-5 ">
            <Button type="button" theme="secondary" class="px-7 duration-300 transition-all py-2 rounded-xl"
                    @click="show = false">Close
            </Button>
            <Button type="submit" theme="primary" class="px-10 duration-300 transition-all py-2 rounded-xl"
            >Save
            </Button>
          </div>
        </form>
      </template>

    </Modal>
  </div>
</template>

<style scoped>
.time-box {
  position: relative;
  width: 10rem; /* tetap agar tidak goyang */
  height: 8rem;
  display: inline-block;
}

@media screen and (max-width: 1024px) {
  .time-box {
    width: 6rem; /* Lebih kecil untuk layar kecil */
    height: 4.5rem;
  }
}

@media screen and  (max-width: 768px) {
  .time-box {
    width: 2.5rem; /* Lebih kecil untuk layar sangat kecil */
    height: 2rem;
  }
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
  transform: scale(0.5);
}

.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: scale(1);
}

</style>
