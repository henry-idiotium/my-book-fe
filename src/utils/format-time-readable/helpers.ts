import { intervalToDuration, isDate, parse as parseFNS, parseISO } from 'date-fns';

import { raise, safeRaise } from '../raise';

import * as Constants from './constants';
import { FormatTimeReadableArgs, RawDate, initialOptions } from './types';

export function getArgs([date, _options]: FormatTimeReadableArgs) {
  const options = { ...initialOptions, ..._options };

  const start = parse(date, options.dateStrFormat);
  const end = options.end
    ? parse(options.end, options.dateStrFormat)
    : raise('format-time-readable options.end is invalid!!');

  return { start, end, options };
}

export function formatRange(start: Date, end: Date) {
  const { hours = 0, minutes = 0, seconds = 0 } = intervalToDuration({ start, end });

  if (hours) return `${hours}h`;
  else if (minutes) return `${minutes}m`;
  else if (seconds && seconds <= Constants.TIME_BEFORE_PASS_NOW) return `${seconds}s`;
  return Constants.Contents.NOW;
}

export function parse(date: RawDate, format?: string) {
  let resultDate: Date;

  switch (typeof date) {
    case 'string':
      resultDate = format ? parseFNS(date, format, new Date()) : parseISO(date);
      break;

    case 'number':
      resultDate = new Date(date);
      break;

    default:
      resultDate = date;
      break;
  }

  if (!isDate(resultDate)) safeRaise(`Invalid time argument ${date.toString()}`);

  return resultDate;
}
