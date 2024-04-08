import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import axios from "axios";

type Props = {
  endpoint: string;
  getToken: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>;
};

export async function getFromAPI({ endpoint, getToken }: Props) {
  console.log("ENVIROMENT:", process.env.NODE_ENV);

  const token = await getToken();
  const domain = process.env.NODE_ENV === "production" ? "https://5738592.xyz" : "http://localhost";
  const port = process.env.SERVER_PORT || 3000;
  const url = `${domain}:${port}${endpoint}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data;
  console.log("Data from API:", data);
  return data;
}
