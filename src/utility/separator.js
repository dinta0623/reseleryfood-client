export const $thousandStrSeparator = (str) => {
  if (str) {
    return str.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return str || "";
};
export const $removeThousandStrSeparator = (str) => {
  if (typeof str === "string") {
    return Number(str.replace(/\./gi, "").replace(/,/gi, ".")) || null;
  }
  return str;
};
export const $addSeparator = (
  num,
  minDecimalDigit = 0,
  maxDecimalDigit = 0,
  isUseBracket = false
) => {
  num = Number(num);
  let displayNum = num.toLocaleString("id", {
    minimumFractionDigits: minDecimalDigit,
    maximumFractionDigits: maxDecimalDigit,
  });
  if (displayNum === "-0") {
    displayNum = 0;
  }
  // use bracket for negatif value
  if (isUseBracket) {
    if (/^-\d+/g.test(displayNum)) {
      displayNum = displayNum.replace(/^-/g, "");
      displayNum = `(${displayNum})`;
    }
  }
  return !isNaN(num) ? displayNum : 0;
};
