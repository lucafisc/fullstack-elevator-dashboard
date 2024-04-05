import { GetTokenSilentlyOptions } from "@auth0/auth0-react";
import axios from "axios";

type Props = {
  endpoint: string;
  getToken: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>;
};

export async function getFromAPI({ endpoint, getToken }: Props) {
  const token = await getToken();

  const response = await axios.get(`https://localhost:3000${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = response.data;
  console.log("Data from API:", data);
  return data;
}
