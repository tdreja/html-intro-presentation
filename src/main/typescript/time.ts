const millisInSecond = 1000;
const millisInMinute = 60 * millisInSecond;
const millisInHour = 60 * millisInMinute;
const millisInDay = 24 * millisInHour;

export interface TimeDifference {
    days: number,
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number,
    fullTimespan: number
}

export function timeDifferenceOfSeconds(seconds: number): TimeDifference {
    return timeDifferenceOfMillis(seconds * millisInSecond);
}

export function calculateDifference(start: Date, end: Date): TimeDifference {
    const startMillis = start.getTime();
    const endMillis = end.getTime();

    let rawMillis;
    if(endMillis > startMillis) {
        rawMillis = endMillis - startMillis;
    } else {
        rawMillis = startMillis - endMillis;
    }

    return timeDifferenceOfMillis(rawMillis);
}

function timeDifferenceOfMillis(fullTimespan: number): TimeDifference {
    let rawMillis = fullTimespan;

    const days = Math.floor(rawMillis / millisInDay);
    rawMillis = rawMillis - (days * millisInDay);

    const hours = Math.floor(rawMillis / millisInHour);
    rawMillis = rawMillis - (hours * millisInHour);

    const minutes = Math.floor(rawMillis / millisInMinute);
    rawMillis = rawMillis - (minutes * millisInMinute);

    const seconds = Math.floor(rawMillis / millisInSecond);
    rawMillis = rawMillis - (seconds * millisInSecond);

    return {
        fullTimespan,
        days,
        hours,
        minutes,
        seconds,
        milliseconds: rawMillis
    };
}