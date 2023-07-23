export const TIME_BEFORE_PASS_NOW = 30;

export const Contents = {
  NOW: 'Now',
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
} as const;

export const DateFormats = {
  // standards
  IN_WEEK: 'E',
  IN_YEAR: 'MMM d',
  PASS_YEAR: 'dd/MM/yyyy',

  /** Month - Year */
  MO_YR: 'MMMM yyyy',

  /** @deprecated */ ALT: 'MMMM yyyy',
} as const;
