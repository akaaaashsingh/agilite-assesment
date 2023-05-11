export const compareArrays = (a, b) =>
  a?.length === b?.length && a?.every((element, index) => element === b[index]);

export const checkYear = (value) => {
  const currentYear = new Date().getFullYear();
  return currentYear >= Number(value) && Number(value) >= 1995;
};
