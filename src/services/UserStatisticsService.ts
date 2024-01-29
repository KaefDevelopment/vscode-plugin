import {api} from "../api";

const STATS_INTERVAL_MS = 10 * 1000;

export class UserStatisticsService {
    constructor() {}

    private _fetchStatistics(onCallback: (seconds: number) => void): void {
        api.statusRepository.apiFetchStatus().then((responce) => {
            if (responce.data?.auth) {
                onCallback(responce.data.stats.total);
            }
        });
    }

    private _start(onCallback: (seconds: number) => void): void {
        setInterval(() => {
            this._fetchStatistics(onCallback);
          }, STATS_INTERVAL_MS);
    }

    public startFetching(onCallback: (seconds: number) => void): void {
        this._fetchStatistics(onCallback);
        this._start(onCallback);
    }
}