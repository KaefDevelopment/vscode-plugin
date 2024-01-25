export const secondsToHms = (minutes: number): string => {
    const h = Math.floor(minutes / 3600);
    const m = Math.floor(minutes % 3600 / 60);

    const array: string[] = [];

    if (h > 0) {
        array.push(`${h}h`);
    }

    if (m > 0) {
        array.push(`${m}m`);
    }

    return array.join(' '); 
};
