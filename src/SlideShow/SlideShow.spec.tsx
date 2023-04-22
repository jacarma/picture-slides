import { render, screen, fireEvent } from "@testing-library/react";
import SlideShow from "./SlideShow";
import * as posts from "./api/posts";
import * as users from "./api/users";
import * as media from "./api/media";
import * as hooks from "usehooks-ts";
import { act } from "react-dom/test-utils";
import * as likeicon from "./LikeIcon";

const intervalMock = {
  fn: console.log,
  tick: () => intervalMock.fn(),
};
vi.spyOn(hooks, "useInterval").mockImplementation((fn) => {
  intervalMock.fn = fn;
  return intervalMock;
});

vi.spyOn(likeicon, "LikeIcon").mockImplementation(() => <div></div>);

vi.spyOn(media, "getMedia").mockImplementation(() =>
  Promise.resolve({
    id: "string",
    urls: {
      raw: "string",
      small: "string",
      thumb: "string",
      regular: "string",
      small_s3: "string",
    },
  })
);
vi.spyOn(users, "getUser").mockImplementation(() =>
  Promise.resolve({
    id: "string",
    username: "string",
    first_name: "string",
    last_name: "string",
    profile_images: {
      small: "string",
      medium: "string",
      large: "string",
    },
  })
);

let id = 0;
vi.spyOn(posts, "getNextPost").mockImplementation(() =>
  Promise.resolve({
    id: `${id++}`,
    created: "2021-05-05",
    mediaId: "string",
    user: {
      id: "string",
      username: "string",
    },
    likes: 2,
    title: `Slide ${id}`,
    description: "string",
  })
);

test("renders slides correctly", async () => {
  render(<SlideShow />);
  const slideHeading = await screen.findAllByTestId("slide");
  expect(slideHeading).toHaveLength(2);

  expect(screen.getByText(/Slide 1/i)).toBeInTheDocument();
  expect(screen.getByText(/Slide 2/i)).toBeInTheDocument();

  // simulate slide change
  await act(intervalMock.tick);
  expect(screen.getByText(/Slide 3/i)).toBeInTheDocument();
  expect(screen.getByText(/Slide 2/i)).toBeInTheDocument();
});

test("renders spinner when no posts available", async () => {
  // mock getNextPost to return null
  vi.spyOn(posts, "getNextPost").mockImplementationOnce(
    () =>
      new Promise<posts.Post>(() => {
        // never resolve
      })
  );

  render(<SlideShow />);
  const spinner = await screen.findByRole("alert");
  expect(spinner).toBeInTheDocument();
});
