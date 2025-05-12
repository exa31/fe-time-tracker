import type {AxiosError} from "axios";

export type ExtendedAxiosError = AxiosError & {
    message: string;
    timestamp: string;
    status: number;
}

export type Response<T> = {
    success: boolean;
    message: string;
    timestamp: string;
    data: T;
}