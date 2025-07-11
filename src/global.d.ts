//import type { InitOptions, $typst as TypstAPI } from "@myriaddreamin/typst.ts";

export {};

declare global {
  interface Window {
    //initTypst?: (opts?: InitOptions) => Promise<void>;
    //$typst?: TypstAPI;
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
