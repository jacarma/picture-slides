import { useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import Slide from "./Slide";
import { Post, getNextPost } from "./api/posts";

export default function SlideShow() {
  const [showTails, setShowTails] = useState(false);
  const [headPost, setHeadPost] = useState<Post | null>(null);
  const [tailsPost, setTailsPost] = useState<Post | null>(null);

  useInterval(() => {
    getNextPost().then((post) => {
      const nextShowTails = !showTails;
      setShowTails(nextShowTails);
      if (nextShowTails) {
        setHeadPost(post);
      } else {
        setTailsPost(post);
      }
    });
  }, 6000);

  useEffect(() => {
    const getPosts = async () => {
      const post0 = await getNextPost();
      const post1 = await getNextPost();
      setHeadPost(post0);
      setTailsPost(post1);
    };
    getPosts();
  }, []);

  return (
    <div className="relative">
      {tailsPost && (
        <Slide post={tailsPost} key={tailsPost.id} preloading={!showTails} />
      )}
      {headPost && (
        <Slide post={headPost} key={headPost.id} preloading={showTails} />
      )}
    </div>
  );
}
