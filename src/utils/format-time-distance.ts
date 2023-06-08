import {
  format,
  getYear,
  intervalToDuration,
  isSameDay,
  lastDayOfWeek,
  startOfWeek,
} from 'date-fns';

type FormatOption = {
  showTimestamp: boolean;
};

export function formatTimeDistance(
  formerDate: Date,
  latterDate = new Date(),
  options?: FormatOption
) {
  if (formerDate > latterDate) return '';

  const { showTimestamp = false } = options ?? {};

  // date templates
  const timestampTmpl = 'H:mm';
  const showTimestampTmpl = showTimestamp ? timestampTmpl : '';
  const inWeekTmpl = ['E', showTimestampTmpl].join(', ');
  const inYearTmpl = ['MM dd', showTimestampTmpl].join(' ');
  const passYearTmpl = ['dd/MM/YYYY', showTimestampTmpl].join(' ');

  const { hours, minutes, seconds } = intervalToDuration({
    start: formerDate,
    end: latterDate,
  });

  // is today (not diff date)
  if (isSameDay(formerDate, latterDate)) {
    return formatRange(hours, minutes, seconds);
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

function formatRange(hours?: number, minutes?: number, seconds?: number) {
  hours ??= 0;
  minutes ??= 0;
  seconds ??= 0;

  if (hours) return hours + 'h';
  else if (minutes) return minutes + 'm';
  else if (seconds) return seconds + 's';
  else return '0s';
}
