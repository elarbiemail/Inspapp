import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'fr'|'en'|'ar';

interface I18nState {
  lang: Lang; t: (k: string) => string; setLang: (l: Lang)=>void; dir: 'ltr'|'rtl';
}

const I18nContext = createContext<I18nState>({ lang: 'fr', t: (k)=>k, setLang: ()=>{}, dir: 'ltr' });

export const I18nProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [lang, setLang] = useState<Lang>((localStorage.getItem('lang') as Lang) || 'fr');
  const [dict, setDict] = useState<Record<string,string>>({});

  useEffect(()=>{ localStorage.setItem('lang', lang); document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    (async ()=>{
      const res = await fetch(`/public/i18n/${lang}.json`).catch(()=>undefined);
      if (res && res.ok) setDict(await res.json()); else setDict({});
    })();
  }, [lang]);

  const t = useMemo(()=> (k: string)=> dict[k] ?? k, [dict]);
  const dir: 'ltr'|'rtl' = lang === 'ar' ? 'rtl' : 'ltr';

  return <I18nContext.Provider value={{ lang, t, setLang, dir }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => useContext(I18nContext);
