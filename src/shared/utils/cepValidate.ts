export const cepValidate = (cep: string): boolean => {
  // Create a regex that matches a string with 8 digits only and only with numbers
  return /^[0-9]{8}$/.test(cep);
};
