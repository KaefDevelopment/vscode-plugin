import {EEventType} from "../enums/event.enum";

export interface IEvent {
    id: string; // random uuid
    createdAt: string; // localDateTime ISO
    type: EEventType;
    project?: string;
    projectBaseDir?: string | null;
    language?: string;
    target?: string;
    branch?: string;
    params?: Record<string, string>
    timezone: string; // ZoneId.systemDefault().id
}
