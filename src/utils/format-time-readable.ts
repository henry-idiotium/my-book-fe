import {
  format,
  getYear,
  intervalToDuration,
  isSameDay,
  isSameWeek,
  parseISO,
  parse as parseFNS,
  subDays,
} from 'date-fns';

const AMOUNT_BEFORE_PASS_NOW = 15;
const NOW_MOMENT = 'Now';

// date formats
const IN_WEEK_FORMAT = 'E';
const IN_YEAR_FORMAT = 'MMM d';
const PASS_YEAR_FORMAT = 'dd/MM/yyyy';

type Options = {
  useYesterday?: boolean;
  dateStrFormat?: string; // specify when input dates are not an ISO date string
};

export function formatTimeReadable(
  _formerDate: Date | string,
  _latterDate: Date | string = new Date(),
  options?: Options
) {
  const formerDate = parse(_formerDate, options?.dateStrFormat);
  const latterDate = parse(_latterDate, options?.dateStrFormat);

  if (formerDate >= latterDate) return NOW_MOMENT;

  const { useYesterday = true } = options ?? {};

  // is today (not diff date)
  if (isSameDay(formerDate, latterDate)) {
    const {
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = intervalToDuration({ start: formerDate, end: latterDate });

    return seconds > AMOUNT_BEFORE_PASS_NOW
      ? formatRange(hours, minutes, seconds)
      : NOW_MOMENT;
  }

  // is yesterday
  else if (useYesterday && isSameDay(formerDate, subDays(latterDate, 1))) {
    return 'Yesterday';
  }

  // still in week
  else if (isSameWeek(formerDate, latterDate)) {
    return format(formerDate, IN_WEEK_FORMAT);
  }

  // still in year
  else if (getYear(formerDate) === getYear(latterDate)) {
    return format(formerDate, IN_YEAR_FORMAT);
  }

  // prev year
  else {
    return format(formerDate, PASS_YEAR_FORMAT);
  }
}

export default formatTimeReadable;

function formatRange(hours: number, minutes: number, seconds: number) {
  if (hours) return hours + 'h';
  else if (minutes) return minutes + 'm';
  else if (seconds) return seconds + 's';
  else return '0s';
}

function parse(date: Date | string, format?: string) {
  if (typeof date === 'string') {
    const parsedDate = format
      ? parseFNS(date, format, new Date())
      : parseISO(date);

    return parsedDate;
  }

  return date;
}
