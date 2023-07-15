import {
  format,
  getYear,
  intervalToDuration,
  isSameDay,
  isSameWeek,
  subDays,
} from 'date-fns';

import * as Constants from './constants';
import { formatRange, getDefaultOption, parse } from './helpers';
import { DateArg, Options } from './types';

export function formatTimeReadable(
  _start: DateArg,
  _end: DateArg = new Date(),
  _options?: Options,
) {
  const options = getDefaultOption(_options);

  const start = parse(_start, options.dateStrFormat);
  const end = parse(_end, options.dateStrFormat);

  if (options.simple) return format(start, Constants.DateFormats.ALT);
  if (start >= end) return Constants.Contents.NOW;

  //* Is in same day
  if (isSameDay(start, end)) {
    const {
      hours = 0,
      minutes = 0,
      seconds = 0,
    } = intervalToDuration({ start, end });

    return seconds > Constants.TIME_BEFORE_PASS_NOW
      ? formatRange(hours, minutes, seconds)
      : Constants.Contents.NOW;
  }
  //* Is yesterday
  else if (options.useYesterday && isSameDay(start, subDays(end, 1))) {
    return Constants.Contents.YESTERDAY;
  }
  //* Still in week
  else if (isSameWeek(start, end)) {
    return format(start, Constants.DateFormats.IN_WEEK);
  }
  //* Still in year
  else if (getYear(start) === getYear(end)) {
    return format(start, Constants.DateFormats.IN_YEAR);
  }
  //* Is in previous year
  else {
    return format(start, Constants.DateFormats.PASS_YEAR);
  }
}
export default formatTimeReadable;
