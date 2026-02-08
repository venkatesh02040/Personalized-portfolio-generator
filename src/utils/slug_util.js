/*
  Generate URL-safe slug from username
*/

const generateSlug = (username) => {
  if (!username) return "";

  return username
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace special chars with -
    .replace(/^-+|-+$/g, "");   // remove leading/trailing -
};

export default generateSlug;
