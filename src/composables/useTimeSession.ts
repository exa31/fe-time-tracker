import {inject, reactive, ref} from "vue";
import type {VueCookies} from "vue-cookies";
import {AxiosError} from "axios";
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import type {GetActiveTimeSessionResponse, TimeSession} from "../model/timeSession.ts";
import {fetchApi} from "../libs";

const useTimeSession = () => {
    const cookie = inject<VueCookies>('$cookies')
    const loading = ref(false)
    const router = useRouter()
    const timeSessionActive = reactive<TimeSession>(
        {
            idUser: 0,
            idTimeSession: 0,
            startTime: "",
            endTime: null,
            description: null,
            duration: null
        }
    )
    const config: {
        headers: {
            Authorization: string;
            "Content-Type": "application/json";
        };
    } = {
        headers: {
            Authorization: `Bearer ${cookie?.get('token')}`,
            "Content-Type": "application/json",
        }
    }

    const startTimeSession = async () => {
        if (loading.value) return
        loading.value = true
        try {
            await fetchApi(
                {
                    url: '/api/1.0/time-sessions/start',
                    config,
                    method: 'post'
                }
            )
            toast.success("Time session started successfully")

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    cookie?.remove("token");
                    window.location.href = "/login"
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
            }
        }
    }

    const getActiveTimeSession = async () => {
        if (loading.value) return
        loading.value = true
        try {
            const data = await fetchApi<GetActiveTimeSessionResponse>({
                url: '/api/1.0/time-sessions/active',
                config,
                method: 'get'
            })
            if (data?.data) {
                Object.assign(timeSessionActive, data.data)
                return
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    cookie?.remove("token");
                    await router.replace('/login')
                } else if (error.status === 404) {
                    return
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
            }
        } finally {
            loading.value = false
        }
    }

    const stopTimeSession = async () => {
        if (loading.value) return
        loading.value = true
        try {
            await fetchApi(
                {
                    url: '/api/1.0/time-sessions/stop',
                    config,
                    method: 'put'
                }
            )
            toast.success("Time session stopped successfully")
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    cookie?.remove("token");
                    await router.replace('/login')
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
            }
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        startTimeSession,
        getActiveTimeSession,
        stopTimeSession,
        timeSessionActive
    }
}

export default useTimeSession