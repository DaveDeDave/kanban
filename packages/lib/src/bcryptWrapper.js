import bcrypt from "bcryptjs";

const genSalt = (length) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(length, (err, salt) => {
      if (err) return reject(err);
      resolve(salt);
    });
  });

const hash = (input, saltLength) =>
  new Promise(async (resolve, reject) => {
    const salt = await genSalt(saltLength);
    bcrypt.hash(input, salt, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });

const compare = (input, hash) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(input, hash, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

export { hash, compare };
