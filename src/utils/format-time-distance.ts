import {
  format,
  getYear,
  intervalToDuration,
  isSameDay,
  lastDayOfWeek,
  startOfWeek,
} from 'date-fns';

type FormatOption = {
  showTimestamp?: boolean;
  timeRangeDefineNow?: number; // seconds
};

export function formatTimeDistance(
  formerDate: Date,
  latterDate = new Date(),
  options?: FormatOption
) {
  if (formerDate > latterDate) return '';

  const { showTimestamp = false, timeRangeDefineNow } = options ?? {};

  // date templates
  const timestampTmpl = 'H:mm';
  const showTimestampTmpl = showTimestamp ? timestampTmpl : '';
  const inWeekTmpl = ['E', showTimestampTmpl].join(', ');
  const inYearTmpl = ['MM dd', showTimestampTmpl].join(' ');
  const passYearTmpl = ['dd/MM/YYYY', showTimestampTmpl].join(' ');

  const {
    hours = 0,
    minutes = 0,
    seconds = 0,
  } = intervalToDuration({ start: formerDate, end: latterDate });

  // is today (not diff date)
  if (isSameDay(formerDate, latterDate)) {
    return !timeRangeDefineNow || seconds > timeRangeDefineNow
      ? formatRange(hours, minutes, seconds)
      : 'now';
  }

  // is yesterday
  else if (hours !== undefined && hours < 48) {
    return `yesterday ${format(latterDate, timestampTmpl)}`;
  }

  // still in week
  else if (
    latterDate > startOfWeek(formerDate) &&
    latterDate < lastDayOfWeek(formerDate)
  ) {
    return format(formerDate, inWeekTmpl);
  }

  // still in year
  else if (getYear(latterDate) === getYear(formerDate)) {
    return format(formerDate, inYearTmpl);
  }

  // prev year
  else {
    return format(formerDate, passYearTmpl);
  }

  // hardly execute, but maybe undiscoverd rare case might occur
  // else return formatDistance(formerDate, latterDate);
}

export default formatTimeDistance;

function formatRange(hours: number, minutes: number, seconds: number) {
  if (hours) return hours + 'h';
  else if (minutes) return minutes + 'm';
  else if (seconds) return seconds + 's';
  else return '0s';
}
