interface ImportMetaEnv {
  /** Public Web3Forms access key. When missing, the contact form falls back to mailto. */
  readonly VITE_WEB3FORMS_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
