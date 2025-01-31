export interface IStatusResponse {
    auth: boolean;
    cliVersion: string;
    notificationList: unknown[];
    tooltip: ITooltipData;
    stats: {
        total: number;
    }
}

export interface ITooltipData {
    markdown: string;
}
