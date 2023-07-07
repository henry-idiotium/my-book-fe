export type SingularClassName = Nullable<GenericObject | string>;
type ClassNameArgs = SingularClassName[];

export function classnames(...props: ClassNameArgs) {
  return props
    .map((className) => {
      const name =
        className && typeof className === 'object'
          ? extractClassScheme(className)
          : className;

      return name;
    })
    .filter((cn) => cn && cn !== '')
    .join(' ');
}

function extractClassScheme(obj: GenericObject) {
  return Object.entries(obj).reduce((finalName, [name, enabled]) => {
    return enabled ? `${finalName} ${name}` : finalName;
  }, '');
}

export default classnames;
