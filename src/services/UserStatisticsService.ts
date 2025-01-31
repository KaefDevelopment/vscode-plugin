import {api, IStatusResponse} from '../api';

const STATS_INTERVAL_MS = 50 * 1000;

export class UserStatisticsService {
    private static _fetchStatistics(onCallback: (statusResponse: IStatusResponse) => void): void {
        api.statusRepository.fetchStatus().then((response) => {
            if (response.data?.auth) {
                onCallback(response.data);
            }
        });
    }

    private static _start(onCallback: (statusResponse: IStatusResponse) => void): void {
        setInterval(() => {
            this._fetchStatistics(onCallback);
          }, STATS_INTERVAL_MS);
    }

    public static startFetching(onCallback: (statusResponse: IStatusResponse) => void): void {
        this._fetchStatistics(onCallback);
        this._start(onCallback);
    }
}
