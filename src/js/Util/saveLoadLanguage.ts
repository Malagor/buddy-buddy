export const saveLanguage = (languageCode: string): void => {
  localStorage.setItem('languageCode', languageCode);
};

export const loadLanguage = (): string => {
  try {
    return localStorage.getItem('languageCode') || 'ENG';
  } catch (e) {
    console.log(e.type);
    console.log(e.message);
    return null;
  }
};
