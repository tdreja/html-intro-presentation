// This file is auto-generated by @hey-api/openapi-ts

export type TimedEvent = {
    name: string;
    description: string;
    image: string;
    start: Date;
    end?: Date;
};

export type DayEvent = {
    name: string;
    description: string;
    image: string;
    day: Date;
};

export type GetTimedEventResponse = (TimedEvent);

export type GetTimedEventError = unknown;

export type GetDayEventResponse = (DayEvent);

export type GetDayEventError = unknown;

export type $OpenApiTs = {
    '/timed-event': {
        get: {
            res: {
                /**
                 * OK
                 */
                '200': TimedEvent;
            };
        };
    };
    '/day-event': {
        get: {
            res: {
                /**
                 * OK
                 */
                '200': DayEvent;
            };
        };
    };
};