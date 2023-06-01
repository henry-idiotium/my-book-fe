type ElementScheme = GenericObject<boolean>;
type Props = ElementScheme | [ElementScheme | string];

export function classes(props: Props) {
  if (Array.isArray(props)) {
    return props.reduce<string>((className, value) => {
      const name =
        typeof value === 'object' ? extractClassScheme(value) : value;

      return `${className} ${name}`;
    }, '');
  } else {
    return extractClassScheme(props);
  }
}

function extractClassScheme(obj: ElementScheme) {
  return Object.entries(obj).reduce((finalName, [name, enabled]) => {
    return enabled ? `${finalName} ${name}` : finalName;
  }, '');
}

export default classes;
