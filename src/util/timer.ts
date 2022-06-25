import {Dayjs} from 'dayjs';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

class GetTimeZoneOption {
    timeZone: string;
}

export const getDateTime = (dateTime?:any,option?:GetTimeZoneOption) :Dayjs => {
    const {timeZone = process.env.DEFAULT_TIME_ZONE } = option;
    const getTime = dayjs(dateTime).tz(timeZone);

    if (!getTime.isValid()) {
        throw new Error('dayjs parse time error');
    }

    return getTime;
}

class GetFormatOption extends GetTimeZoneOption {
    joinBy?: string;
}

export const getYYYYMMDD = (dateTime?:any,option?:GetFormatOption) :string => {
    const  { joinBy = '' } = option;
    const formats = ['YYYY','MM','DD'];
    return getDateTime(dateTime,option).format(formats.join(joinBy));
}

export const getHHmmss = (dateTime?:any,option?:GetFormatOption) :string => {
    const  { joinBy = '' } = option;
    const formats = ['HH','mm','ss'];
    return getDateTime(dateTime,option).format(formats.join(joinBy));
}
