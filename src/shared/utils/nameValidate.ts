export const nameValidate = (name: string): boolean => {
  return /^[a-zA-ZÀ-ú_.-\s]+$/.test(name);
};
