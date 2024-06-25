export const streetValidate = (street: string): boolean => {
  return /^[[0-9a-zA-ZÀ-ú_.-{1,100}\s]+$/.test(street);
};
