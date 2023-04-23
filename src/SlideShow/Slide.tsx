import { formatRelative } from "date-fns";
import { memo, useEffect, useState } from "react";
import { Media, getMedia } from "./api/media";
import { Post } from "./api/posts";
import { User, getUser } from "./api/users";
import { LikeIcon } from "./LikeIcon";

const Slide = memo(Slide_);
export default Slide;

function Slide_({ post, preloading }: { post: Post; preloading: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [media, setMedia] = useState<Media | null>(null);
  useEffect(() => {
    getUser(post.user.username).then(setUser);
    getMedia(post.mediaId).then(setMedia);
  }, [post.user.username, post.mediaId]);
  return (
    <div
      id={post.id}
      data-testid="slide"
      className={`w-full h-[100vh] absolute bg-white grid grid-rows-3 sm:grid-rows-1 sm:grid-cols-3 transition-opacity duration-300 ${
        preloading ? "-z-10 opacity-0" : "z-10 opacity-100"
      }`}
    >
      <div className="row-span-2 sm:row-span-1 sm:col-span-2 h-full w-full relative">
        <img
          className="object-cover w-full h-full blur absolute"
          src={media?.urls.small}
        />
        <img
          className="object-contain w-full h-full absolute"
          src={media?.urls.regular}
        />
      </div>
      <div className="bg-neutral-200 flex p-6 flex-col z-10">
        <div className="flex justify-center align-middle items-center">
          <div className="flex-1 text-right mr-4 text-gray-500">
            {user?.first_name} {user?.last_name}
          </div>
          <img
            className="w-10 h-10 rounded-full"
            src={user?.profile_images.medium}
          />
        </div>
        <div className="flex-1 content-center grid">
          <div className="text-xl text-gray-600">{post.title}</div>
          <div className="text-gray-500">{post.description}</div>
        </div>
        <div className="mb-4 flex text-xs items-center ">
          <LikeIcon className="w-6 h-6 border-white rounded-full border-2 mr-2" />
          {post.likes} personnes
        </div>
        <div className="text-xs text-gray-500">{formatDate(post.created)}</div>
      </div>
    </div>
  );
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (!(date instanceof Date) || isNaN(date.valueOf())) return "";
  return formatRelative(date, new Date());
}
