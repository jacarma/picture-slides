import { Handler } from "@netlify/functions";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const handler: Handler = async (event) => {
  try {
    const getIdParam = (paramName: string) => {
      const param = event.queryStringParameters?.[paramName];
      if (param === undefined || param === null)
        throw new Error(`Missing required parameter: ${paramName}`);
      return param;
    };

    const mediaId = getIdParam("media-id");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://apis.slstice.com/mock/medias/${mediaId}?api_key=${process.env.SLSTICE_API_KEY}`,
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
