const APP_NAME = import.meta.env.VITE_APP_NAME;

export function setDocumentTitle(suffixName?: string) {
  document.title = [APP_NAME, suffixName].filter(Boolean).join(' | ');
}
export default setDocumentTitle;
