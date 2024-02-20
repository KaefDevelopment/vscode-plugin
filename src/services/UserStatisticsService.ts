import {api} from "../api";

const STATS_INTERVAL_MS = 50 * 1000;

export class UserStatisticsService {
    private static _fetchStatistics(onCallback: (seconds: number) => void): void {
        api.statusRepository.fetchStatus().then((responce) => {
            if (responce.data?.auth) {
                onCallback(responce.data.stats.total);
            }
        });
    }

    private static _start(onCallback: (seconds: number) => void): void {
        setInterval(() => {
            this._fetchStatistics(onCallback);
          }, STATS_INTERVAL_MS);
    }

    public static startFetching(onCallback: (seconds: number) => void): void {
        this._fetchStatistics(onCallback);
        this._start(onCallback);
    }
}
