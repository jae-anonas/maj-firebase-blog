/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Search from "../components/Search";
import Card from "../components/Card";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";
import Tags from "../components/common/Tags";
import InfiniteScroll from "react-infinite-scroll-component";
import CardSkeleton from "../components/skeleton/CardSkeleton";

const Articles = () => {
  const [blogsData, setBlogsData] = useState();
  const [loading, setLoading] = useState(true);
  const [lastBlog, setLastBlog] = useState(null);
  const [infiniteLoading, setInfiniteLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogRef = collection(db, "blogs");
        const q = query(blogRef, orderBy("timestamp", "desc"), limit(6));
        console.log(q);

        const docSnap = await getDocs(q);
        const lastVisible = docSnap.docs[docSnap.docs.length - 1];
        setLastBlog(lastVisible);
        const blogs = [];
        docSnap.forEach((doc) => {
          console.log(doc);
          blogs.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setBlogsData(blogs);
        console.log(blogsData)
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Unable to load articles");
      } finally {
        console.log('got here new finally');
        setInfiniteLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const fetchMoreBlogs = async () => {
    if (!hasMore) return;

    setInfiniteLoading(true);
    try {
      const blogRef = collection(db, "blogs");
      const q = query(
        blogRef,
        // orderBy("timestamp", "desc"),
        startAfter(lastBlog),
        limit(4)
      );
      const docSnap = await getDocs(q);
      const lastVisible = docSnap.docs[docSnap.docs.length - 1];

      if (docSnap.empty) {
        setHasMore(false);
        toast.success("All blogs fetched!!");
      }
      setLastBlog(lastVisible);
      const blogs = [];
      docSnap.forEach((doc) => {
        blogs.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setBlogsData([...blogsData, ...blogs]);

      console.log('got here try end');
    } catch (error) {
      console.log(error);
      toast.error("Could not fetch more blogs !!");
    } finally {
      setInfiniteLoading(false);
    }
  };

  return (
    <div className='mx-auto max-w-7xl'>
      <h1 className=' my-12 text-center text-4xl font-extrabold'>Articles</h1>

      <div className=''>
        <Search />
      </div>
      {/* Tags/categories */}
      <Tags />

      {!loading ? (
        <InfiniteScroll
          dataLength={blogsData?.length || []}
          next={fetchMoreBlogs}
          hasMore={hasMore}
          className='mx-auto mt-12 grid w-[95%] grid-cols-1 gap-5 text-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
          loader={
            <div className='loader flex h-24 w-24 justify-center rounded-full border-8 border-t-8 border-gray-200 ease-linear'></div>
          }
        >
          {blogsData?.map((blog, index) => (
            <Card key={index} id={blog.id} blog={blog.data} />
          ))}
        </InfiniteScroll>
      ) : (
        <div className='mx-auto mt-12 grid w-[95%] grid-cols-1 gap-5 text-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'>
          {/* Show Skeleton component as a placeholder while data is loading */}
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
