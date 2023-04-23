import axios from "axios";
import memoize from "fast-memoize";

export type User = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_images: {
    small: string;
    medium: string;
    large: string;
  };
};

const performRequest = memoize((username: string) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/.netlify/functions/user?username=${username}`,
  };
  return axios.request(config);
});

export async function getUser(username: string) {
  const { data } = await performRequest(username);
  if (!data.success) throw new Error(`Error fetching posts: ${data}`);
  return data.response.user;
}
