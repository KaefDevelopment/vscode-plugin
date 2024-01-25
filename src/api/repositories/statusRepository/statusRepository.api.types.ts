export interface IStatusResponce {
    auth: boolean;
    cliVersion: string;
    notificationList: unknown[];
    stats: {
        total: number;
    }
}
