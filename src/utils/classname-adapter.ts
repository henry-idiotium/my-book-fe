type ElementScheme = GenericObject<boolean>;
type Props = (ElementScheme | string | undefined)[];

export function classes(...props: Props) {
  return props.filter(Boolean).reduce<string>((className, value) => {
    const name = typeof value === 'object' ? extractClassScheme(value) : value;

    return `${className} ${name}`;
  }, '');
}

function extractClassScheme(obj: ElementScheme) {
  return Object.entries(obj).reduce((finalName, [name, enabled]) => {
    return enabled ? `${finalName} ${name}` : finalName;
  }, '');
}

export default classes;
