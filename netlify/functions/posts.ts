import dotenv from "dotenv";
import axios, { AxiosRequestConfig } from "axios";
import { Handler } from "@netlify/functions";

dotenv.config();

export const handler: Handler = async (event) => {
  try {
    const getNumberParam = (paramName: string, dflt: number) => {
      const param = event.queryStringParameters?.[paramName];
      if (param === undefined || param === null) return dflt;
      const num = parseInt(param, 10);
      return isNaN(num) ? dflt : num;
    };

    const offset = getNumberParam("offset", 0);
    const limit = getNumberParam("limit", offset + 15);
    const config: AxiosRequestConfig = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://apis.slstice.com/mock/posts?offset=${offset}&limit=${limit}&api_key=${process.env.SLSTICE_API_KEY}`,
      headers: {
        Accept: "application/json",
      },
    };
    const response = await axios.request(config);

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }, null, 2),
    };
  }
};
