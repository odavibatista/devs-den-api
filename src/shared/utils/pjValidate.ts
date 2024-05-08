export const pjValidate = (cnpj: string): boolean => {
    if (cnpj.length !== 14) {
      return false
    }
  
    const array = cnpj.split('')
    const firstDigit = Number(array[12])
    const secondDigit = Number(array[13])
  
    const firstSum =
      Number(array[0]) * 5 +
      Number(array[1]) * 4 +
      Number(array[2]) * 3 +
      Number(array[3]) * 2 +
      Number(array[4]) * 9 +
      Number(array[5]) * 8 +
      Number(array[6]) * 7 +
      Number(array[7]) * 6 +
      Number(array[8]) * 5 +
      Number(array[9]) * 4 +
      Number(array[10]) * 3 +
      Number(array[11]) * 2
  
    const firstRemainder = firstSum % 11
    const firstResult = firstRemainder < 2 ? 0 : 11 - firstRemainder
  
    const secondSum =
      Number(array[0]) * 6 +
      Number(array[1]) * 5 +
      Number(array[2]) * 4 +
      Number(array[3]) * 3 +
      Number(array[4]) * 2 +
      Number(array[5]) * 9 +
      Number(array[6]) * 8 +
      Number(array[7]) * 7 +
      Number(array[8]) * 6 +
      Number(array[9]) * 5 +
      Number(array[10]) * 4 +
      Number(array[11]) * 3 +
      firstResult * 2
  
    const secondRemainder = secondSum % 11
    const secondResult = secondRemainder < 2 ? 0 : 11 - secondRemainder
  
    if (firstResult !== firstDigit || secondResult !== secondDigit) {
      return false
    }
  
    return true
  }