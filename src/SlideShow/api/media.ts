import axios from "axios";

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
async function getMedia_(mediaId: string) {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/.netlify/functions/media?media-id=${mediaId}`,
  };
  const { data } = await axios.request(config);
  if (!data.success) throw new Error(`Error fetching media: ${data}`);
  return data.response.media as Media;
}

let lastRequest: {
  mediaId: string;
  promise: Promise<Media>;
} | null = null;

export async function getMedia(
  mediaId: string,
  maxRetries = 10
): Promise<Media> {
  try {
    if (lastRequest?.mediaId === mediaId) return await lastRequest.promise;
    lastRequest = { mediaId, promise: getMedia_(mediaId) };
    return await lastRequest.promise;
  } catch (ex) {
    if (maxRetries > 0) {
      return await getMedia(mediaId, maxRetries - 1);
    } else {
      throw new Error("can't find media " + mediaId);
    }
  }
}
