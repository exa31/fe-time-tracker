import {inject, reactive, ref} from "vue";
import type {VueCookies} from "vue-cookies";
import {AxiosError} from "axios";
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {
    type GetActiveTimeSessionResponse,
    type GetTimeSessionsResponse,
    type TimeSession,
    UpdateTimeSession
} from "../model/timeSession.ts";
import {fetchApi, validateForm} from "../libs";
import {ZodError} from "zod";

const useTimeSession = () => {
    const cookie = inject<VueCookies>('$cookies')
    const loading = ref(false)
    const loadingTimeSession = ref(false)
    const errorMessages = reactive({
        description: "",
    })
    const router = useRouter()
    const data = reactive<TimeSession[]>([])
    const timeSessionActive = reactive<TimeSession>(
        {
            id_user: 0,
            id: 0,
            start_time: 0,
            end_time: undefined,
            description: undefined,
            duration: undefined
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
        if (loadingTimeSession.value) return
        loadingTimeSession.value = true
        try {
            await fetchApi(
                {
                    url: '/api/v1/time-sessions/start',
                    config,
                    method: 'post'
                }
            )
            timeSessionActive.start_time = Date.now()
            toast.success("Time session started successfully")

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    cookie?.remove("token");
                    window.location.href = "/login"
                    throw error
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                    throw error
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
                throw error
            }
        } finally {
            loadingTimeSession.value = false
        }
    }

    const getActiveTimeSession = async () => {
        if (loading.value) return
        loading.value = true
        try {
            const data = await fetchApi<GetActiveTimeSessionResponse>({
                url: '/api/v1/time-sessions/active',
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
        if (loadingTimeSession.value) return
        loadingTimeSession.value = true
        try {
            await fetchApi(
                {
                    url: '/api/v1/time-sessions/stop',
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
                    throw error
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                    throw error
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
                throw error
            }
        } finally {
            loadingTimeSession.value = false
        }
    }

    const getAllTimeSession = async () => {
        try {
            const res = await fetchApi<GetTimeSessionsResponse>({
                url: '/api/v1/time-sessions',
                config,
                method: 'get'
            })
            if (res?.data) {
                const dataSorted = res.data.sort((a, b) => {
                    return new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
                })
                Object.assign(data, dataSorted)
                return
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.status === 401) {
                    cookie?.remove("token");
                    await router.replace('/login')
                    throw error
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                    throw error
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
                throw error
            }
        }
    }

    const updateTimeSession = async (id: number, body: { description: string }) => {
        if (loadingTimeSession.value) return
        loadingTimeSession.value = true
        Object.assign(errorMessages, {
            description: "",
        })
        try {
            await validateForm(body, UpdateTimeSession)
            await fetchApi(
                {
                    url: `/api/v1/time-sessions/${id}/update`,
                    config,
                    method: 'put',
                    body
                }
            )
            toast.success("Time session updated successfully")
        } catch (error) {
            if (error instanceof ZodError) {
                toast.error("Please check your input", {
                    position: "top-right",
                    autoClose: 2000,
                });
                const errorMap: { [key: string]: string } = {
                    description: "",
                }
                error.errors.forEach((err) => {
                    const field = err.path[0]
                    if (field in errorMap) {
                        errorMap[field] = err.message
                    }
                })
                Object.assign(errorMessages, errorMap) // langsung update reactive object
                throw error
            } else if (error instanceof AxiosError) {
                if (error.status === 401) {
                    cookie?.remove("token");
                    toast.error("Session expired, please login again", {
                        position: "top-right",
                        autoClose: 2000,
                    })
                    await router.replace('/login')
                    throw error
                } else {
                    toast.error(error.response?.data?.message);
                    console.error(error.response?.data?.message);
                    throw error
                }
            } else {
                console.error("An unexpected error occurred:", error);
                toast.error("An unexpected error occurred");
                throw error
            }
        } finally {
            loadingTimeSession.value = false
        }
    }

    return {
        data,
        getAllTimeSession,
        errorMessages,
        updateTimeSession,
        loading,
        startTimeSession,
        getActiveTimeSession,
        stopTimeSession,
        timeSessionActive
    }
}

export default useTimeSession