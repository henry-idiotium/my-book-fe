import { format, getYear, isSameDay, isSameWeek, subDays } from 'date-fns';

import * as Constants from './constants';
import { formatRange, getArgs } from './helpers';
import { FormatTimeReadableArgs } from './types';

export function formatTimeReadable(...args: FormatTimeReadableArgs) {
  const { start, end, options } = getArgs(args);

  if (options.type === 'no times') return format(start, Constants.DateFormats.MO_YR);

  function getTypeFormat(prefix: string) {
    return format(start, options.type === 'full' ? `${prefix}, p` : prefix);
  }

  //* same day
  if (isSameDay(start, end)) {
    return options.type === 'full' ? format(start, 'p') : formatRange(start, end);
  }

  //* yesterday
  else if (!options.disableYesterdayAnnotation && isSameDay(start, subDays(end, 1))) {
    return getTypeFormat("'" + Constants.Contents.YESTERDAY + "'");
  }

  //* same week
  else if (isSameWeek(start, end)) {
    return getTypeFormat('EEEE');
  }

  //* same year
  else if (getYear(start) === getYear(end)) {
    return getTypeFormat('MMM d');
  }

  //* previous year
  else {
    return getTypeFormat('dd/MM/yyyy');
  }
}

export default formatTimeReadable;
