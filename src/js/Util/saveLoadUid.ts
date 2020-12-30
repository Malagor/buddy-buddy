export const saveUID = (uid: string): void => {
  localStorage.setItem('uid', uid);
};

export const loadUID = (): string => {
  try {
    return localStorage.getItem('uid');
  } catch (e) {
    console.log(e.type);
    console.log(e.message);
    return null;
  }
};
