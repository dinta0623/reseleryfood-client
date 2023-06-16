export const tzoffset = new Date().getTimezoneOffset() * 60000;

export const addDays = (total = 0, date = new Date()) => {
  return new Date(
    new Date(new Date(date).getTime() - tzoffset).setDate(
      date.getDate() + total
    )
  );
};

export const mySqlDate = (date = new Date()) => {
  return new Date(new Date(date).getTime() - tzoffset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
};
