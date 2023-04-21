import axios, { AxiosResponse } from "axios";

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

export type UserResponse = {
  success: boolean;
  response: {
    user: User;
  };
};

const users: { [key: string]: User | Promise<AxiosResponse<UserResponse>> } =
  {};
export async function getUser(username: string) {
  if (users[username]) {
    if (users[username] instanceof Promise) {
      const response = (await users[username]) as AxiosResponse<UserResponse>;
      return response.data.response.user;
    }
    return users[username];
  }

  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/.netlify/functions/user?username=${username}`,
  };
  const promise = axios.request(config);
  users[username] = promise;
  const { data } = await promise;
  if (!data.success) throw new Error(`Error fetching posts: ${data}`);
  users[username] = data.response.user;
  return data.response.user;
}
