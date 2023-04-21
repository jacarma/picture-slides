import axios from "axios";
import memoizeOne from "memoize-one";
const PAGE_SIZE = 15;
let currentPostsPage = 0;

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
const postsQueue: Post[] = [];

const performRequest = memoizeOne((offset: number) => {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `/.netlify/functions/posts?offset=${offset}&limit=${PAGE_SIZE}`,
  };
  return axios.request(config);
});

async function getNextPostsPage_() {
  // TODO: what happens when we reach the end
  const offset = currentPostsPage * PAGE_SIZE;
  const { data } = await performRequest(offset);
  if (!data || !data.success) throw new Error(`Error fetching posts: ${data}`);
  postsQueue.push(...data.response.posts);
  currentPostsPage++;
}

export async function getNextPost() {
  if (!postsQueue.length) {
    await getNextPostsPage();
  }
  if (postsQueue.length < 3) {
    getNextPostsPage();
  }
  const post = postsQueue.shift();
  if (!post) throw new Error("No posts available");
  return post;
}

export async function getNextPostsPage(maxRetries = 10) {
  try {
    await getNextPostsPage_();
  } catch (ex) {
    if (maxRetries === 0) throw ex;
    await getNextPostsPage(maxRetries - 1);
  }
}
