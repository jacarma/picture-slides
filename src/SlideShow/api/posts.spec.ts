import axios from "axios";
import { getNextPost, getNextPostsPage } from "./posts";

vi.mock("axios", () => ({
  default: {
    request: vi.fn(),
  },
}));

// const axios = axios as vi.Mocked<typeof axios>;

describe("posts testing", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getNextPost function", () => {
    it("should fetch the next post from the queue", async () => {
      const mockPost = {
        id: "123",
        created: "2021-11-02",
        mediaId: "abc",
        user: {
          id: "456",
          username: "johndoe",
        },
        likes: 10,
        title: "Post title",
        description: "Post description",
      };
      axios.request.mockResolvedValueOnce({
        data: {
          success: true,
          response: {
            posts: [mockPost, mockPost, mockPost, mockPost, mockPost],
          },
        },
      });
      const post = await getNextPost();
      expect(post).toEqual(mockPost);
      expect(axios.request).toHaveBeenCalledTimes(1);
    });
  });

  describe("getNextPostsPage function", () => {
    it("should fetch the next page of posts and add them to the queue", async () => {
      const mockPost1 = {
        id: "123",
        created: "2021-11-02",
        mediaId: "abc",
        user: {
          id: "456",
          username: "johndoe",
        },
        likes: 10,
        title: "Post title",
        description: "Post description",
      };
      const mockPost2 = {
        id: "456",
        created: "2021-11-01",
        mediaId: "def",
        user: {
          id: "789",
          username: "janedoe",
        },
        likes: 5,
        title: null,
        description: "Another post description",
      };
      axios.request.mockResolvedValueOnce({
        data: {
          success: true,
          response: {
            posts: [mockPost1, mockPost2],
          },
        },
      });
      await getNextPostsPage();
      expect(axios.request).toHaveBeenCalledTimes(1);
      axios.request.mockClear();

      const mockPost3 = {
        id: "789",
        created: "2021-11-01",
        mediaId: "ghi",
        user: {
          id: "123",
          username: "testuser",
        },
        likes: 3,
        title: "Third post",
        description: "Third post description",
      };
      axios.request.mockResolvedValueOnce({
        data: {
          success: true,
          response: {
            posts: [mockPost3],
          },
        },
      });
      await getNextPostsPage();
      expect(axios.request).toHaveBeenCalledTimes(1);
      const post = await getNextPost();
      expect(post).toEqual(mockPost1);
    });

    it("should throw error if request fails", async () => {
      const errorMessage = "Failed to fetch posts!";
      axios.request.mockRejectedValueOnce(new Error(errorMessage));
      await expect(getNextPostsPage()).rejects.toThrowError();
    });

    it("should retry fetching the next page multiple times if maxRetries is set", async () => {
      const mockPost = {
        id: "123",
        created: "2021-11-02",

        mediaId: "abc",
        user: {
          id: "456",
          username: "johndoe",
        },
        likes: 10,
        title: "Post title",
        description: "Post description",
      };
      axios.request.mockRejectedValueOnce(new Error("Server error"));
      axios.request.mockRejectedValueOnce(new Error("Another server error"));
      axios.request.mockResolvedValueOnce({
        data: {
          success: true,
          response: {
            posts: [mockPost],
          },
        },
      });
      await getNextPostsPage();
      expect(axios.request).toHaveBeenCalledTimes(3);
    });
  });
});
