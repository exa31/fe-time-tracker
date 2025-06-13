import type {Response} from "./index.ts";
import {z} from "zod";

export type TimeSession = {
    id_user: number;
    id: number;
    start_time: EpochTimeStamp;
    end_time?: number;
    description?: string;
    duration?: string;
}

export type GetActiveTimeSessionResponse = Response<TimeSession | null>

export type GetTimeSessionsResponse = Response<TimeSession[]>

export const UpdateTimeSession = z.object({
    description: z.string().min(5, "description must be at least 5 characters"),
})