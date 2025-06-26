interface ThemeClasses {
  container: string;
  header: {
    wrapper: string;
    background: string;
    name: string;
    contact: {
      container: string;
      item: string;
      separator: string;
      link: string;
    };
  };
  section: {
    wrapper: string;
    title: string;
    titleSeparator?: string;
    icon?: string;
  };
  education: {
    item: string;
    institution: string;
    degree: string;
    date: string;
    gpa: string;
  };
  experience: {
    item: string;
    company: string;
    title: string;
    date: string;
    location: string;
    achievement: string;
    achievementList: string;
  };
  projects: {
    wrapper: string;
    item: string;
    name: string;
    description: string;
    technology: string;
    achievement: string;
    achievementList: string;
  };
  skills: {
    wrapper: string;
    container: string;
    category: string;
    items: string;
  };
}

// Classic: Clean, Traditional, ATS-friendly

const classicClasses: ThemeClasses = {
  container: "min-h-full px-12 py-8 font-serif text-[11px] text-black leading-tight",
  header: {
    wrapper: "my-4 text-center",
    background: "",
    name: "text-[24px] font-bold text-black mb-2 tracking-wide",
    contact: {
      container: "flex justify-center gap-2 mb-3",
      item: "flex items-center",
      separator: "pr-2 text-black",
      link: "hover:underline",
    },
  },
  section: {
    wrapper: "mb-6 break-inside-avoid", // mb-4 break-inside-avoid
    title: "mb-2 border-b border-black text-lg font-bold text-black uppercase",
    titleSeparator: "", // not used
  },
  education: {
    item: "mb-3 break-inside-avoid", //"mb-2 break-inside-avoid"
    institution: "font-bold text-black",
    degree: "text-black",
    date: "text-black font-normal",
    gpa: "text-black",
  },
  experience: {
    item: "mb-5 break-inside-avoid", //"mb-4 break-inside-avoid"
    company: "font-bold text-black",
    title: "text-black italic",
    date: "text-black font-normal",
    location: "text-black",
    achievement: "text-[11px] text-black leading-tight mt-1",
    achievementList: "list-disc list-outside ms-6 text-[11px] text-black leading-tight space-y-0.5", // "list-disc list-outside ms-6 text-xs text-black "
  },
  projects: {
    wrapper: "mb-4 break-inside-avoid",
    item: "mb-2 break-inside-avoid", // "mb-2 break-inside-avoid text-black"
    name: "font-bold text-black inline",
    description: "text-black inline",
    technology: "text-black inline font-medium",
    achievement: "text-[11px] text-black leading-tight",
    achievementList: "list-disc list-outside ml-4 text-[11px] text-black leading-tight space-y-0.5",
  },
  skills: {
    wrapper: "mb-4 break-inside-avoid",
    container: "",
    category: "font-medium text-black inline min-w-32",
		items: "text-black inline",
  },
};

/*
// Creative: Contemporary design with subtle colors and modern typography
const creativeClasses: ThemeClasses = {
  container: "min-h-full px-10 py-8 font-sans text-[10px] text-gray-900 bg-white",
  header: {
    wrapper: "mb-6 pb-4 border-b-2 border-blue-500",
    background: "",
    name: "text-[32px] font-bold text-gray-900 mb-2 tracking-tight",
    contact: {
      container: "flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-gray-600",
      item: "flex items-center gap-1 hover:text-blue-600 transition-colors",
      separator: "",
      link: "hover:text-blue-600 underline decoration-blue-500 decoration-2 underline-offset-2",
    },
  },
  section: {
    wrapper: "mb-6 break-inside-avoid",
    title: "mb-3 text-[13px] font-bold text-blue-600 uppercase tracking-wide flex items-center",
    icon: "mr-2 text-[16px]",
    titleSeparator: "",
  },
  education: {
    item: "mb-3 p-3 break-inside-avoid bg-blue-50 border-l-4 border-blue-500 rounded-r",
    institution: "font-bold text-gray-900",
    degree: "text-gray-800 italic",
    date: "text-gray-600",
    gpa: "text-gray-600 font-medium",
  },
  experience: {
    item: "mb-4 p-3 break-inside-avoid bg-gray-50 border-l-4 border-gray-400 rounded-r",
    company: "font-bold text-gray-900",
    title: "text-blue-600 font-semibold italic",
    date: "text-gray-600",
    location: "text-gray-600",
    achievement: "text-[10px] text-gray-800 leading-relaxed mt-2",
    achievementList: "list-disc list-outside ml-4 text-[10px] text-gray-800 leading-relaxed space-y-1 mt-2",
  },
  projects: {
    wrapper: "mb-6 break-inside-avoid",
    item: "mb-3 p-3 bg-green-50 border-l-4 border-green-500 rounded-r break-inside-avoid",
    name: "font-bold text-gray-900 inline",
    description: "text-gray-800 inline",
    technology: "text-green-600 inline font-semibold",
    achievement: "text-[10px] text-gray-800 leading-relaxed",
    achievementList: "list-disc list-outside ml-4 text-[10px] text-gray-800 leading-relaxed space-y-1 mt-2",
  },
  skills: {
    wrapper: "mb-6 break-inside-avoid",
    container: "grid grid-cols-2 gap-y-2 gap-x-8",
    category: "font-bold text-blue-600",
    items: "text-gray-800 mt-1",
  },
};

// Modern: Clean, Professional, Tech-focused
const modernClasses: ThemeClasses = {
  container: "min-h-full px-16 py-12 font-sans text-[10px] text-gray-900 leading-tight",
  header: {
    wrapper: "mb-6 text-left",
    background: "",
    name: "text-[28px] font-light text-gray-900 mb-2 tracking-tight",
    contact: {
      container: "flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-700",
      item: "hover:text-blue-600 transition-colors",
      separator: "",
      link: "hover:text-blue-600 underline decoration-1 underline-offset-2",
    },
  },
  section: {
    wrapper: "mb-5 break-inside-avoid",
    title: "mb-3 text-[11px] font-semibold text-gray-900 uppercase tracking-widest",
    titleSeparator: "mb-3 h-px bg-gray-300",
  },
  education: {
    item: "mb-3 break-inside-avoid",
    institution: "font-semibold text-gray-900",
    degree: "text-gray-800",
    date: "text-gray-600",
    gpa: "text-gray-600",
  },
  experience: {
    item: "mb-4 break-inside-avoid",
    company: "font-semibold text-gray-900",
    title: "text-gray-800 font-medium",
    date: "text-gray-600",
    location: "text-gray-600",
    achievement: "text-[10px] text-gray-800 leading-relaxed mt-1",
    achievementList: "list-disc list-outside ml-4 text-[10px] text-gray-800 leading-relaxed space-y-1",
  },
  projects: {
    wrapper: "mb-5 break-inside-avoid",
    item: "mb-3 break-inside-avoid",
    name: "font-semibold text-gray-900 inline",
    description: "text-gray-800 inline",
    technology: "text-blue-600 inline font-medium",
    achievement: "text-[10px] text-gray-800 leading-relaxed",
    achievementList: "list-disc list-outside ml-4 text-[10px] text-gray-800 leading-relaxed space-y-1",
  },
  skills: {
    wrapper: "mb-5 break-inside-avoid",
    container: "space-y-1",
    category: "font-semibold text-gray-900 inline-block w-24",
    items: "text-gray-800 inline",
  },
};

const themeClassMap: Record<string, ThemeClasses> = {
  classic: classicClasses,
  creative: creativeClasses,
  modern: modernClasses,
};
*/

// Classic: Clean, Traditional, ATS-friendly
/*
const classicClasses: ThemeClasses = {
  container: "min-h-full px-12 py-8 font-serif text-[11px] text-black leading-tight",
  header: {
    wrapper: "my-4 text-center",
    background: "",
    name: "text-[24px] font-bold text-black mb-2 tracking-wide",
    contact: {
      container: "flex justify-center gap-2 mb-3",
      item: "flex items-center",
      separator: "pr-2 text-black",
      link: "hover:underline",
    },
  },
  section: {
    wrapper: "mb-6 break-inside-avoid",
    title: "mb-2 border-b border-black text-lg font-bold text-black uppercase",
    titleSeparator: "",
  },
  education: {
    item: "mb-3 break-inside-avoid",
    institution: "font-bold text-black",
    degree: "text-black",
    date: "text-black font-normal",
    gpa: "text-black",
  },
  experience: {
    item: "mb-5 break-inside-avoid",
    company: "font-bold text-black",
    title: "text-black italic",
    date: "text-black font-normal",
    location: "text-black",
    achievement: "text-[11px] text-black leading-tight mt-1",
    achievementList: "list-disc list-outside ms-6 text-[11px] text-black leading-tight space-y-0.5",
  },
  projects: {
    wrapper: "mb-4 break-inside-avoid",
    item: "mb-2 break-inside-avoid",
    name: "font-bold text-black inline",
    description: "text-black inline",
    technology: "text-black inline font-medium",
    achievement: "text-[11px] text-black leading-tight",
    achievementList: "list-disc list-outside ml-4 text-[11px] text-black leading-tight space-y-0.5",
  },
  skills: {
    wrapper: "mb-4 break-inside-avoid",
    container: "",
    category: "font-medium text-black inline min-w-32",
    items: "text-black inline",
  },
};
*/

// Modern Professional - Clean, Professional, Tech-focused
const modernClasses: ThemeClasses = {
  container: "min-h-full px-16 py-12 font-sans text-[10px] text-gray-900 leading-[1.3] max-w-[8.5in] mx-auto",
  header: {
    wrapper: "mb-6 text-center border-gray-300 pb-4",
    background: "",
    name: "text-[20px] font-bold text-gray-900 mb-1 tracking-tight uppercase",
    contact: {
      container: "flex justify-center items-center gap-3 text-[9px] text-gray-700",
      item: "flex items-center",
      separator: "text-gray-400 mx-1",
      link: "text-blue-600 hover:underline font-medium",
    },
  },
  section: {
    wrapper: "mb-4 break-inside-avoid",
    title: "mb-2 text-[10px] font-bold text-gray-900 uppercase tracking-[0.5px] border-b border-gray-900 pb-0.5",
    titleSeparator: "",
  },
  education: {
    item: "mb-2 break-inside-avoid",
    institution: "font-bold text-gray-900 text-[10px]",
    degree: "text-gray-800 text-[10px]",
    date: "text-gray-700 text-[10px] font-medium",
    gpa: "text-gray-700 text-[10px]",
  },
  experience: {
    item: "mb-3 break-inside-avoid",
    company: "font-bold text-gray-900 text-[10px]",
    title: "text-gray-800 font-semibold text-[10px]",
    date: "text-gray-700 text-[10px] font-medium",
    location: "text-gray-700 text-[10px]",
    achievement: "text-[9px] text-gray-800 leading-[1.4] mt-0.5",
    achievementList: "list-disc list-outside ml-4 text-[9px] text-gray-800 leading-[1.4] space-y-0.5 mt-1",
  },
	projects: {
    wrapper: "mb-4 break-inside-avoid",
    item: "mb-2 break-inside-avoid",
    name: "font-bold text-gray-900 inline text-[10px]",
    description: "text-gray-800 inline text-[10px] ml-1",
    technology: "text-blue-600 inline font-medium text-[10px]",
    achievement: "text-[9px] text-gray-800 leading-[1.4]",
    achievementList: "list-disc list-outside ml-4 text-[9px] text-gray-800 leading-[1.4] space-y-0.5 mt-1",
  },
  skills: {
    wrapper: "mb-4 break-inside-avoid",
    container: "space-y-1",
    category: "font-bold text-gray-900 inline-block w-20 text-[10px]",
    items: "text-gray-800 inline text-[10px]",
  },
};


// Creative Bold - Uniform pastel design with consistent styling
const creativeClasses: ThemeClasses = {
  container: "min-h-full px-10 py-8 font-sans text-[10px] text-gray-900 bg-white max-w-[8.5in] mx-auto",
  header: {
    wrapper: "mb-6 text-center bg-gradient-to-r from-slate-500 to-slate-600 text-white p-6 rounded-lg shadow-sm",
    background: "bg-gradient-to-r from-slate-500 to-slate-600",
    name: "text-[28px] font-bold text-white mb-2 tracking-tight",
    contact: {
      container: "flex justify-center items-center flex-wrap gap-2 text-[10px] text-slate-100",
      item: "flex items-center gap-1 hover:text-white transition-colors",
      separator: "text-slate-200 mx-1",
      link: "text-white hover:text-slate-100 underline decoration-1 underline-offset-2",
    },
  },
  section: {
    wrapper: "mb- break-inside-avoid",
    title: "text-[12px] font-bold text-slate-700 uppercase tracking-wide flex items-center relative pb-2",
    titleSeparator: "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-400 to-transparent",
    icon: "mr-2 text-[14px]",
  },
  education: {
    item: "mb-3 p-4 break-inside-avoid bg-rose-50 border-l-4 border-rose-300 rounded-r-lg shadow-sm",
    institution: "font-bold text-gray-900 text-[11px]",
    degree: "text-gray-800 text-[10px] mt-0.5",
    date: "text-gray-600 text-[10px] font-medium",
    gpa: "text-gray-700 font-medium text-[10px]",
  },
  experience: {
    item: "mb-3 p-4 break-inside-avoid bg-blue-50 border-l-4 border-blue-300 rounded-r-lg shadow-sm",
    company: "font-bold text-gray-900 text-[11px]",
    title: "text-slate-600 font-semibold text-[10px] mt-0.5",
    date: "text-gray-600 text-[10px] font-medium",
    location: "text-gray-600 text-[10px]",
    achievement: "text-[10px] text-gray-800 leading-relaxed mt-2",
    achievementList: "list-disc list-outside ml-4 text-[10px] text-gray-800 leading-relaxed space-y-1 mt-2",
  },
  projects: {
    wrapper: "mb-6 break-inside-avoid",
    item: "mb-4 p-4 bg-emerald-50 border-l-4 border-emerald-300 rounded-r-lg shadow-sm break-inside-avoid",
    name: "font-bold text-gray-900 inline text-[11px]",
    description: "text-gray-800 inline text-[10px] ml-2",
    technology: "text-slate-600 inline font-semibold text-[10px]",
    achievement: "text-[10px] text-gray-800 leading-relaxed",
    achievementList: "list-disc list-outside ml-4 text-[10px] text-gray-800 leading-relaxed space-y-1 mt-2",
  },
  skills: {
    wrapper: "mb-6 break-inside-avoid",
    container: "space-y-2",
    category: "font-bold text-slate-700 text-[11px] inline-block w-30",
    items: "text-gray-800 text-[10px] inline",
  },
};

const themeClassMap: Record<string, ThemeClasses> = {
  classic: classicClasses,
  creative: creativeClasses,
  modern: modernClasses,
};


export const getThemeClasses = (templateId: string): ThemeClasses => {
  return themeClassMap[templateId] ?? classicClasses;
};