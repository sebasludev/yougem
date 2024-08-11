import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import AnimatedSVG from "../../components/icons/loading";

async function fetchVideos(query) {
  const response = await fetch(
    `http://localhost:5000/api/learn?topic=${query}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
}

function removeEndPunctuation(str) {
  const punctuationRegex = /[.,;:!?]/; // Adjust as needed
  return str.replace(punctuationRegex, "").trim();
}

function LearnSearchResultsPage() {
  const { subject, level } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["learnTopic", subject],
    queryFn: () => fetchVideos(subject),
    staleTime: Infinity,
    enabled: !!subject,
  });

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen flex-grow w-full shrink-0'>
        <AnimatedSVG width={200} />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  return (
    <div className=' flex-grow px-10 py-10'>
      <div className='flex justify-start gap-10 flex-wrap'>
        {data.map((video) => (
          <Link
            to={`/learn/${level}/${subject}/video/${removeEndPunctuation(
              video.video_title
            )}/${video.video_id}`}
            key={video.id}
            className=' h-fit w-[300px] space-y-3 group'
          >
            <div className='aspect-video rounded-sm'>
              <img
                src={video.thumbnail_url}
                alt={video.video_title}
                className='object-cover w-full h-full rounded-sm'
              />
            </div>
            <div className='space-y-1'>
              <h3 className='font-bold text-white text-lg group-hover:text-orange-600 group-hover:font-bold'>
                {video.video_title}
              </h3>
              <p className='font-medium text-white text-sm group-hover:text-orange-600 group-hover:font-bold'>
                {video.channel_title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LearnSearchResultsPage;
