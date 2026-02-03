import bcrypt from 'bcrypt';

const saltRounds = 10;

// hash password
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

// compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
