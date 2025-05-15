import type {Response} from "./index.ts";

export type TimeSession = {
    idUser: number;
    idTimeSession: number;
    startTime: EpochTimeStamp;
    endTime?: number;
    description?: string;
    duration?: string;
}

export type GetActiveTimeSessionResponse = Response<TimeSession | null>

export type GetTimeSessionsResponse = Response<TimeSession[]>