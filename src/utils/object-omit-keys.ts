export function objectOmitKeys<TObject extends GenericObject>(
  obj: TObject,
  keys: string[],
) {
  const target: GenericObject = {};

  for (const i in obj) {
    if (keys.indexOf(i) >= 0) continue;

    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;

    target[i] = obj[i];
  }

  return target;
}

export default objectOmitKeys;
