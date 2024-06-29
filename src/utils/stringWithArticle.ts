const VOWELS = ["a", "o", "u", "i", "e"];

const stringWithArticle = (string: string) => {
  return VOWELS.includes(string.charAt(0).toLowerCase())
    ? `an ${string}`
    : `a ${string}`;
};

export default stringWithArticle;
