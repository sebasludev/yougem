import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AnimatedSVG from "../../components/icons/loading";

const fetchVideos = async (q) => {
  const url = new URL(`http://localhost:5000/api/search`);
  if (q) {
    url.searchParams.append("q", q);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function SearchPage() {
  let [searchParams] = useSearchParams();
  let [query, setQuery] = useState(searchParams.get("q"));
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["video", query],
    queryFn: () => fetchVideos(query),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnReconnect: false,
    retry: false,
  });

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen flex-grow'>
        <AnimatedSVG width={200} />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (data.response)
    return (
      <div className='text-white text-center flex justify-center items-center'>
        <div className='border-2 border-white py-48 px-20'>
          <h1 className='mb-10'>{data.response} </h1>
          <Link className='text-blue-500' to='/'>
            Back to Home
          </Link>
        </div>
      </div>
    );
  return (
    <div className=' px-10 py-10 flex-grow'>
      <div className='grid grid-cols-4 justify-start  gap-x-5 gap-y-10 '>
        {data.map((video) => (
          <Link
            to={`/watch?v=${video.video_id}`}
            key={video.id}
            className=' h-fit w-[300px] space-y-3 group'
            state={video.video_title}
          >
            <div className='aspect-video rounded-sm'>
              <img
                src={video.thumbnail_url}
                alt={video.video_title}
                className='object-cover w-full h-full rounded-sm'
              />
            </div>
            <div className='space-y-1 text-white'>
              <h3 className='font-bold  text-lg group-hover:text-orange-500 group-hover:font-bold'>
                {video.video_title}
              </h3>
              <p className='font-medium  text-sm group-hover:text-orange-500 group-hover:font-bold'>
                {video.channel_title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchPage;
