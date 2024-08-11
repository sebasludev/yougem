import { useVideoPlayer } from "../../../context/VideoContext";
import { useEpisodes } from "../../../context/EpisodesContext";
import AnimatedCircles from "../../../components/icons/loading2";

export const Episodes = () => {
  const { episodes, isLoading, error, episodesContainerRef } = useEpisodes();
  const { currentTime, seekTo, setVideoEndTime } = useVideoPlayer();

  const handleTime = (start, end) => {
    seekTo(start);
    setVideoEndTime(end);
  };

  const calculateProgress = (start, end) => {
    if (currentTime >= start && currentTime <= end) {
      return ((currentTime - start) / (end - start)) * 100;
    }
    return 0;
  };

  if (isLoading)
    return (
      <div>
        <AnimatedCircles />
      </div>
    );
  if (error) return <div>No Episodes available{error.message}</div>;

  return (
    <div
      ref={episodesContainerRef}
      className='relative w-full px-10 py-5 overflow-y-auto'
    >
      <div className='space-y-3'>
        <ul className='space-y-6'>
          {JSON.parse(episodes).episodes.map((episode, index) => (
            <li key={index}>
              <button
                onClick={() => handleTime(episode.start, episode.end)}
                className='text-start border-2 border-white px-4 py-6  flex flex-col w-full relative '
              >
                <h2 className='text-xl font-bold mb-2 text-red-500'>
                  Episode {index + 1}
                </h2>
                <p>{episode.summary}</p>
                <div className='w-full l h-2.5 mt-2'>
                  <div
                    className='bg-red-500 h-1'
                    style={{
                      width: `${calculateProgress(
                        episode.start,
                        episode.end
                      )}%`,
                    }}
                  ></div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
