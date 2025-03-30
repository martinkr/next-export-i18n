import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useLanguagePathname = () => {
  const pathname = usePathname();

  const language = useMemo(() => {
    if (!pathname) {
      return '';
    }
    const trimmedPathname = pathname.replace(/^\/+/, ''); // Trim starting '/'
    return trimmedPathname.split('/')?.[0];
    
  }, [pathname]);

  return language;
}

