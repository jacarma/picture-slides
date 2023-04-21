import axios from "axios";
import memoizeOne from "memoize-one";

export type Media = {
  id: string;
  urls: {
    raw: string;
    small: string;
    thumb: string;
    regular: string;
    small_s3: string;
  };
};

// sometimes react renders the same component twice in a row
// so we need to memoize the request to prevent double requests
const performRequest = memoizeOne((mediaId: string) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/.netlify/functions/media?media-id=${mediaId}`,
  };
  return axios.request(config);
});

export async function getMedia(
  mediaId: string,
  maxRetries = 10
): Promise<Media> {
  try {
    const { data } = await performRequest(mediaId);
    if (!data.success) throw new Error(`Error fetching media: ${data}`);
    return data.response.media as Media;
  } catch (ex) {
    if (maxRetries > 0) {
      return await getMedia(mediaId, maxRetries - 1);
    } else {
      throw new Error("can't find media " + mediaId);
    }
  }
}
