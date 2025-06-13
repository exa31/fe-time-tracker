import axios, {AxiosError} from "axios";
import {ZodSchema} from "zod";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
});

export const fetchApi = async <T>({url, config, body, method}: {
    url: string, config:
        {
            headers: {
                Authorization: string;
                "Content-Type": "application/json" | "multipart/form-data";
            };
        },
    body?: object | FormData,
    method: "get" | "post" | "put" | "delete" | "patch"
}) => {
    let retries = 3;
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
    while (retries) {
        try {
            switch (method) {
                case "get": {
                    const res = await apiClient.get<T>(url, config);
                    return res.data;
                }
                case "post": {
                    const res = await apiClient.post<T>(url, body, config);
                    return res.data;
                }
                case "put": {
                    const res = await apiClient.put<T>(url, body, config);
                    return res.data;
                }
                case "delete": {
                    const res = await apiClient.delete<T>(url, config);
                    return res.data;
                }
                case "patch": {
                    const res = await apiClient.patch<T>(url, body, config);
                    return res.data;
                }
                default:
                    throw new Error("Invalid method");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (
                    error.status === 401 ||
                    error.status === 403 ||
                    error.status === 404 ||
                    error.status === 400
                ) {
                    throw error;
                }
            }
            retries -= 1;
            if (!retries) {
                throw error;
            }
            await delay(1000 * (3 - retries)); // Jeda naik dikalikan dengan retries yang tersisa
        }
    }
}

export const validateForm = async <T>(values: T, schema: ZodSchema) => {
    await schema.parseAsync(values);
};

export const formatTime = (raw: number, viewType: string) => {
    const date = new Date(raw);
    if (isNaN(date.getTime())) return "Invalid date";

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

    let datePart = "";

    switch (viewType) {
        case "full-date":
            datePart = `${dayNum} ${monthName} ${year}`;
            break;
        case "day-date":
            datePart = `${dayName}, ${dayNum} ${monthName}`;
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

    return `${datePart}, ${hour}:${minute}`;
}