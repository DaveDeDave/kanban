export const addCORSHeadersToRequest = (
  res: Response,
  { origin }: { origin: string } = { origin: "*" }
) => {
  const response = new Response(res.body, res);
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Headers", "*");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  return response;
};

export const handleCORSPreflight = ({ origin }: { origin: string } = { origin: "*" }) => {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    }
  });
};
