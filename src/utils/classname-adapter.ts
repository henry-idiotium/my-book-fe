type ElementScheme = GenericObject;
type Props = (ElementScheme | string | undefined)[];

export function classnames(...props: Props) {
  return props
    .map((className) => {
      const name =
        typeof className === 'object'
          ? extractClassScheme(className)
          : className;

      return name;
    })
    .filter((cn) => cn && cn !== '')
    .join(' ');
}

function extractClassScheme(obj: ElementScheme) {
  return Object.entries(obj).reduce((finalName, [name, enabled]) => {
    return enabled ? `${finalName} ${name}` : finalName;
  }, '');
}

export default classnames;
