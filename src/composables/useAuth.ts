import {type VueCookies} from 'vue-cookies'
import {inject, reactive, ref} from "vue";
import {fetchApi, validateForm} from "../libs";
import {
    type LoginRequest,
    type LoginResponse,
    LoginSchema,
    type RegisterRequest,
    type RegisterResponse,
    RegisterSchema
} from "../model/auth.ts";
import {useRouter} from "vue-router";
import {toast} from "vue3-toastify";
import {AxiosError} from "axios";
import {ZodError, type ZodIssue} from "zod";

const useAuth = () => {
    const cookie = inject<VueCookies>('$cookies')
    const loading = ref(false)
    const errorMessages = reactive<Partial<LoginRequest & RegisterRequest>>({
        email: "",
        name: "",
        confirmPassword: "",
        password: "",
    })
    const router = useRouter()
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

    const login = async (email: string, password: string) => {
        if (loading.value) return
        loading.value = true
        Object.assign(errorMessages, {
            email: "",
            name: "",
            confirmPassword: "",
            password: "",
        })
        const body = {
            email,
            password
        }
        try {
            await validateForm<LoginRequest>(body, LoginSchema)
            const response = await fetchApi<LoginResponse>({
                url: '/api/1.0/auth/login',
                config,
                body,
                method: 'post'
            })
            cookie?.set('token', response?.data)
            await router.replace('/')
        } catch (error) {
            if (error instanceof ZodError) {
                // Reset error messages
                toast.error("Please check your input", {
                    position: "top-right",
                    autoClose: 2000,
                })
                const errorMap: Record<keyof typeof errorMessages, string> = {
                    email: '',
                    name: '',
                    password: '',
                    confirmPassword: '',
                }

                error.errors.forEach((err: ZodIssue) => {
                    const field = err.path[0] as keyof typeof errorMessages
                    if (field in errorMap) {
                        errorMap[field] = err.message
                    }
                })
                Object.assign(errorMessages, errorMap) // langsung update reactive object
            } else if (error instanceof AxiosError) {
                const message = error.response?.data?.message ?? 'Something went wrong';
                toast.error(
                    message,
                    {
                        position: "top-right",
                        autoClose: 2000,
                    }
                )
            } else {
                toast.error(
                    "Something went wrong",
                    {
                        position: "top-right",
                        autoClose: 2000,
                    }
                )
            }
        } finally {
            loading.value = false
        }
    }

    const register = async (name: string, email: string, password: string, confirmPassword: string) => {
        if (loading.value) return
        loading.value = true
        Object.assign(errorMessages, {
            email: "",
            name: "",
            confirmPassword: "",
            password: "",
        })
        const body = {
            email,
            password,
            name,
            confirmPassword
        }
        try {
            await validateForm<RegisterRequest>(body, RegisterSchema)
            const response = await fetchApi<RegisterResponse>({
                url: '/api/1.0/auth/register',
                config,
                body,
                method: 'post'
            })
            toast.success(response?.message, {
                position: "top-right",
                autoClose: 2000,
            })
            cookie?.set('token', response?.data)
            await router.replace('/')
        } catch (error) {
            if (error instanceof ZodError) {
                // Reset error messages
                toast.error("Please check your input", {
                    position: "top-right",
                    autoClose: 2000,
                })
                const errorMap: Record<keyof typeof errorMessages, string> = {
                    email: '',
                    name: '',
                    password: '',
                    confirmPassword: '',
                }

                error.errors.forEach((err: ZodIssue) => {
                    const field = err.path[0] as keyof typeof errorMessages
                    if (field in errorMap) {
                        errorMap[field] = err.message
                    }
                })
                Object.assign(errorMessages, errorMap) // langsung update reactive object
            } else if (error instanceof AxiosError) {
                const message = error.response?.data?.message ?? 'Something went wrong';
                toast.error(
                    message,
                    {
                        position: "top-right",
                        autoClose: 2000,
                    }
                )
            } else {
                toast.error(
                    "Something went wrong",
                    {
                        position: "top-right",
                        autoClose: 2000,
                    }
                )
            }
        } finally {
            loading.value = false
        }
    }

    return {
        login,
        register,
        errorMessages
    }
}

export default useAuth