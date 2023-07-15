import { parse as parseFNS, parseISO } from 'date-fns';

import { DateArg, Options, initialOptions } from './types';

export function getDefaultOption(options?: Options) {
  return {
    ...initialOptions,
    ...(options ?? {}),
  };
}

export function formatRange(hours: number, minutes: number, seconds: number) {
  if (hours) return `${hours}h`;
  else if (minutes) return `${minutes}m`;
  else if (seconds) return `${seconds}s`;
  return '0s';
}

export function parse(date: DateArg, format?: string) {
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

  return resultDate;
}
