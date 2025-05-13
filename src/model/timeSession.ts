import type {Response} from "./index.ts";

export type TimeSession = {
    idUser: number;
    idTimeSession: number;
    startTime: EpochTimeStamp;
    endTime: string | null;
    description: string | null;
    duration: string | null;
}

export type GetActiveTimeSessionResponse = Response<TimeSession | null>