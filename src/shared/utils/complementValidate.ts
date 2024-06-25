export const complementValidate = (number: string): boolean => {
    return /^[0-9a-zA-Z-{1,100}]+$/.test(number);
  };  