/* Import Package */
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

/* Environment Variables */
const { DEFAULT_TIME_ZONE } = process.env;
class GetTimeZoneOption {
    timeZone?: string;
}

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateTime = (dateTime?:any, option:GetTimeZoneOption = {}) :Dayjs => {
    // Normalize all parsing through the configured time zone before converting to UTC.
    const { timeZone = DEFAULT_TIME_ZONE } = option;
    const getTime = dayjs(dateTime).tz(timeZone).utc();

    if (!getTime.isValid()) {
        throw new Error('dayjs parse time error');
    }

    return getTime;
};

class GetFormatOption extends GetTimeZoneOption {
    joinBy?: string;
}

export const getYYYYMMDD = (dateTime?:any,option?:GetFormatOption) :string => {
    const { joinBy = '' } = option || {};
    const formats = ['YYYY','MM','DD'];
    return getDateTime(dateTime,option).format(formats.join(joinBy));
};

export const getHHmmss = (dateTime?:any,option?:GetFormatOption) :string => {
    const { joinBy = '' } = option || {};
    const formats = ['HH','mm','ss'];
    return getDateTime(dateTime,option).format(formats.join(joinBy));
};
