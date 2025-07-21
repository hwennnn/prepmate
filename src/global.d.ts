export {};

declare global {
  // Declaring Javascript wrapper interface to silent es-linting
  // for when initializing typst compiler from CDN (web assembly modules)
  // For client only
  interface Window {
    $typst?: {
      setCompilerInitOptions: (options: { getModule: () => string }) => void;
      setRendererInitOptions: (options: { getModule: () => string }) => void;
      addSource: (path: string, content: string) => Promise<void>;
      svg: (options: {
        mainFilePath: string;
        inputs: Record<string, string>;
      }) => Promise<string>;
    };
    __typstInited?: boolean;
  }
}
