// Temporary Preview Designs

interface TemplatePreviewProps {
  templateId: string;
}

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  return (
    <div className="aspect-[8.5/11] overflow-hidden rounded-lg border-2 bg-white p-3 shadow-sm transition-all duration-200 hover:shadow-md">
      {templateId === "modern" && (
        <div className="h-full w-full space-y-2">
          <div className="space-y-1">
            <div className="h-3 w-3/4 rounded bg-slate-800"></div>
            <div className="h-1 w-1/2 rounded bg-slate-400"></div>
            <div className="h-1 w-full rounded bg-blue-500"></div>
          </div>
          <div className="space-y-1">
            <div className="h-1 w-2/3 rounded bg-slate-300"></div>
            <div className="h-1 w-1/2 rounded bg-slate-300"></div>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 w-1/3 rounded bg-slate-600"></div>
            <div className="space-y-1">
              <div className="h-1 w-full rounded bg-slate-200"></div>
              <div className="h-1 w-5/6 rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 w-1/2 rounded bg-slate-600"></div>
            <div className="space-y-1">
              <div className="h-1 w-full rounded bg-slate-200"></div>
              <div className="h-1 w-4/5 rounded bg-slate-200"></div>
              <div className="h-1 w-3/4 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      )}
      {templateId === "classic" && (
        <div className="h-full w-full space-y-2">
          <div className="space-y-1 text-center">
            <div className="mx-auto h-3 w-2/3 rounded bg-slate-800"></div>
            <div className="mx-auto h-1 w-1/2 rounded bg-slate-400"></div>
            <div className="mx-auto h-1 w-3/4 rounded bg-slate-400"></div>
          </div>
          <div className="h-0.5 w-full rounded bg-slate-400"></div>
          <div className="space-y-2">
            <div className="h-1.5 w-1/3 rounded bg-slate-700"></div>
            <div className="space-y-1">
              <div className="h-1 w-full rounded bg-slate-200"></div>
              <div className="h-1 w-5/6 rounded bg-slate-200"></div>
              <div className="h-1 w-4/5 rounded bg-slate-200"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-1.5 w-2/5 rounded bg-slate-700"></div>
            <div className="space-y-1">
              <div className="h-1 w-full rounded bg-slate-200"></div>
              <div className="h-1 w-3/4 rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      )}
      {templateId === "creative" && (
        <div className="h-full w-full space-y-2">
          <div className="flex space-x-2">
            <div className="h-8 w-1 rounded bg-gradient-to-b from-purple-500 to-pink-500"></div>
            <div className="flex-1 space-y-1">
              <div className="h-3 w-3/4 rounded bg-slate-800"></div>
              <div className="h-1 w-1/2 rounded bg-purple-400"></div>
            </div>
          </div>
          <div className="flex h-full space-x-2">
            <div className="w-2/3 space-y-2">
              <div className="space-y-1">
                <div className="h-1.5 w-1/2 rounded bg-purple-600"></div>
                <div className="h-1 w-full rounded bg-slate-200"></div>
                <div className="h-1 w-5/6 rounded bg-slate-200"></div>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-2/3 rounded bg-purple-600"></div>
                <div className="h-1 w-full rounded bg-slate-200"></div>
                <div className="h-1 w-4/5 rounded bg-slate-200"></div>
              </div>
            </div>
            <div className="w-1/3 space-y-2">
              <div className="space-y-1">
                <div className="h-1.5 w-full rounded bg-pink-500"></div>
                <div className="h-1 w-3/4 rounded bg-slate-200"></div>
                <div className="h-1 w-full rounded bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}