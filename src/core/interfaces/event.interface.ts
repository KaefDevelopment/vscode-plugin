import {EEventType} from "../enums/event.enum";

export interface IEvent {
    id: string;
    pluginId: string;
    createdAt: string;
    type: EEventType | string;
    project?: string;
    projectBaseDir?: string | null;
    language?: string;
    target?: string;
    branch?: string;
    params?: Record<string, string>
    timezone: string;
}
