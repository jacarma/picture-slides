import axios, { AxiosResponse } from "axios";
const PAGE_SIZE = 15;
let currentPostsPage = 0;
const MAX_RETRIES = 10;

export type Post = {
  id: string;
  created: string;
  mediaId: string;
  user: {
    id: string;
    username: string;
  };
  likes: number;
  title: string | null;
  description: string;
};
export type PostsResponse = {
  success: boolean;
  response: { posts: Post[] };
};
const posts: Post[] = [];
let lastRequestPromise: Promise<AxiosResponse<PostsResponse>> | null = null;
let isRequesting = false;

export async function getNextPostsPage() {
  if (isRequesting) return await lastRequestPromise;
  isRequesting = true;
  await withRetries(getNextPostsPage_, MAX_RETRIES);
  isRequesting = false;
}

async function getNextPostsPage_() {
  // TODO: what happens when we reach the end
  // TODO: retries

  // is case there is a request already in progress we wait for it to finish
  const offset = currentPostsPage * PAGE_SIZE;
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/.netlify/functions/posts?offset=${offset}&limit=${PAGE_SIZE}`,
  };
  lastRequestPromise = axios.request<PostsResponse>(config);
  const { data } = await lastRequestPromise;
  if (!data || !data.success) throw new Error(`Error fetching posts: ${data}`);
  posts.push(...data.response.posts);
  currentPostsPage++;
}

export async function getNextPost() {
  if (!posts.length) {
    // if we have no posts we need to wait
    await getNextPostsPage();
  }
  if (posts.length < 3) {
    // when we have few posts we start asking for more without the await
    getNextPostsPage();
  }
  const post = posts.shift();
  if (!post) throw new Error("No posts available");
  return post;
}

async function withRetries(fn: () => void, maxRetries = 0) {
  try {
    await fn();
  } catch (ex) {
    if (maxRetries === 0) throw ex;
    await withRetries(fn, maxRetries - 1);
  }
}
