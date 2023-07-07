const IS_DEV = import.meta.env.DEV;

type LogFunction = typeof console.log;

const defaultLogValue: LogFunction = () => undefined;

export const Logger = {
  log: defaultLogValue,
  error: defaultLogValue,
  warn: defaultLogValue,
  info: defaultLogValue,
};
export default Logger;

for (const type of Object.keys(Logger) as (keyof typeof Logger)[]) {
  Logger[type] = IS_DEV ? console[type].bind(window.console) : () => undefined;
}
