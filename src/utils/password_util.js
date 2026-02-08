import bcrypt from "bcryptjs";

/*
  Hash plain text password
*/
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/*
  Compare plain password with hashed password
*/
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
