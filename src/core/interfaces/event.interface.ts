import {EEventType} from "../enums/event.enum";

export interface IEvent {
    id: string;
    createdAt: string;
    type: EEventType | string;
    project?: string;
    projectBaseDir?: string | null;
    language?: string;
    target: string;
    branch?: string;
    params?: Record<string, string | number>
    timezone: string;
}

export interface IEventBunch {
    amount: number;
    eventsJson: string;
}
