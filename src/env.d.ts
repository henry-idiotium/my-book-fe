/// <reference types="vite/client" />

type ImportMetaEnv = Readonly<{
  VITE_PORT: string;
  VITE_SERVER_URL: string;
  VITE_SERVER_CONVERSATION_URL: string;
  VITE_APP_NAME: string;
}>;

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
