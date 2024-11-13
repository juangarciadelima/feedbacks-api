export const convertToInternationalDate = (date: string) => {
  const [day, month, year] = date.split("/");
  return `${month}/${day}/${year}`;
};
