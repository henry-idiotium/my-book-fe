import {
  format,
  getYear,
  intervalToDuration,
  isSameDay,
  isSameWeek,
  subDays,
} from 'date-fns';

type Options = {
  useYesterday?: boolean;
};

export function formatTimeReadable(
  formerDate: Date,
  latterDate = new Date(),
  options?: Options
) {
  if (formerDate > latterDate) return '';

  const { useYesterday = true } = options ?? {};

  // date formats
  const inWeekFormat = 'E';
  const inYearFormat = 'MMM d';
  const passYearFormat = 'dd/MM/yyyy';

  // is today (not diff date)
  if (isSameDay(formerDate, latterDate)) {
    const {
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = intervalToDuration({ start: formerDate, end: latterDate });

    return formatRange(hours, minutes, seconds);
  }

  // is yesterday
  else if (useYesterday && isSameDay(formerDate, subDays(latterDate, 1))) {
    return 'Yesterday';
  }

  // still in week
  else if (isSameWeek(formerDate, latterDate)) {
    return format(formerDate, inWeekFormat);
  }

  // still in year
  else if (getYear(formerDate) === getYear(latterDate)) {
    return format(formerDate, inYearFormat);
  }

  // prev year
  else {
    return format(formerDate, passYearFormat);
  }
}

export default formatTimeReadable;

function formatRange(hours: number, minutes: number, seconds: number) {
  if (hours) return hours + 'h';
  else if (minutes) return minutes + 'm';
  else if (seconds) return seconds + 's';
  else return '0s';
}
