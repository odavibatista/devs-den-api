export const nameValidate = async (name: string): Promise<boolean> => {
    return /^[a-zA-Z]$/.test(
      name,
    );
  };
  