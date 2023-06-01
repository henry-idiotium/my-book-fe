export function getAppUrl(rawUrl = import.meta.url) {
  const urlScheme = new URL(rawUrl);
  return urlScheme.origin;
}

export default getAppUrl;
