import jose from "node-jose";
import { HTTPError } from "./error.js";

let keystore;
let key;

const loadKeystore = async () => {
  if (!keystore) {
    keystore = await jose.JWK.asKeyStore(KEYSTORE);
    key = keystore.all({ use: "sig" })[0];
  }
};

const ONE_WEEK = 60 * 60 * 24 * 7;

const sign = async (input, { expiresIn = ONE_WEEK } = { expiresIn: ONE_WEEK }) => {
  await loadKeystore();
  input.exp = Date.now() + expiresIn * 1000;
  const opts = { compact: true, fields: { typ: "JWT" } };
  const token = await jose.JWS.createSign(opts, key).update(JSON.stringify(input)).final();
  return token;
};

const verify = async (input) => {
  await loadKeystore();
  let result;
  try {
    result = await jose.JWS.createVerify(keystore, { algorithms: ["RS256"] }).verify(input);
  } catch (e) {
    throw new HTTPError({ code: "error.invalid_token", status: 401, message: "Invalid token" });
  }
  const payload = JSON.parse(result.payload.toString());
  if (payload.exp !== undefined && payload.exp <= Date.now())
    throw new HTTPError({ code: "error.expired_token", status: 401, message: "Expired token" });
  return payload;
};

export { sign, verify };
