import bcrypt from "bcryptjs";

const genSalt = (length: number): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(length, (err, salt) => {
      if (err) return reject(err);
      resolve(salt);
    });
  });

const hash = (input: string, saltLength: number): Promise<string> =>
  new Promise((resolve, reject) => {
    genSalt(saltLength)
      .then((salt) => {
        bcrypt.hash(input, salt, (err, hash) => {
          if (err) return reject(err);
          resolve(hash);
        });
      })
      .catch((err) => reject(err));
  });

const compare = (input: string, hash: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    bcrypt.compare(input, hash, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

export { hash, compare };
