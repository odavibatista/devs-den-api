export const nameValidate = (name: string): boolean => {
    return  /^[a-zA-Z_.-\s]+$/.test(
      name,
    );
  };
  