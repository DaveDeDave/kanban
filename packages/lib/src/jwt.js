import jose from "node-jose";

let keystore;
let key;

const loadKeystore = async () => {
  if (!keystore) {
    keystore = await jose.JWK.asKeyStore(KEYSTORE);
    key = keystore.all({ use: "sig" })[0];
  }
};

const ONE_WEEK = 60 * 60 * 24 * 7;

const sign = async (input, { expiresIn = ONE_WEEK }) => {
  await loadKeystore();
  input.exp = Date.now() + expiresIn * 1000;
  const opts = { compact: true, fields: { typ: "JWT" } };
  const token = await jose.JWS.createSign(opts, key).update(JSON.stringify(input)).final();
  return token;
};

const verify = async (input) => {
  await loadKeystore();
  const result = await jose.JWS.createVerify(keystore, { algorithms: ["RS256"] }).verify(input);
  const payload = JSON.parse(result.payload.toString());
  if (payload.exp <= Date.now()) throw new Error("Expired");
  return result.payload;
};

export { sign, verify };
