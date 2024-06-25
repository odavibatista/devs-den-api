export const cepValidate = (cep: string): boolean => {
  return /^[0-9{8,8}]+$/.test(cep);
};
