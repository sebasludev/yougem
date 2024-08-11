import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import AnimatedSVG from "../../components/icons/loading";

const levels = ["fundamentals", "intermediate", "advanced"];

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function fetchRoadmap(query) {
  const response = await fetch(
    `http://localhost:5000/api/learn?subject=${query}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
}

function RoadmapOutlinePage() {
  let [searchParams] = useSearchParams();
  let [query, setQuery] = useState(searchParams.get("subject"));
  const [_, setNavbarData] = useLocalStorage("navbar", null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["learnResult", query],
    queryFn: () => fetchRoadmap(query),
    staleTime: Infinity,
  });
  useEffect(() => {
    if (data) {
      const levelsNavbar = {
        prompt: data.prompt,
        plan: [
          { fundamentals: [...data.plan["fundamentals"]["subjects"]] },
          { intermediate: [...data.plan["intermediate"]["subjects"]] },
          { advanced: [...data.plan["advanced"]["subjects"]] },
        ],
      };
      setNavbarData(JSON.stringify(levelsNavbar));
    }
  }, [data, query, setNavbarData]);

  if (isLoading)
    return (
      <div className='flex justify-center items-center h-screen'>
        <AnimatedSVG width={200} />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;
  return (
    <div className='h-full space-y-10'>
      <h1 className='text-5xl font-bold text-red-200'>{data.prompt}</h1>
      <div className='space-y-10 '>
        {levels.map((level) => (
          <div
            key={level}
            className='
                   py-24 px-16 
                  
                  border-2
                  border-white 
                  flex space-x-8 w-full'
          >
            <div className=' space-y-5 w-[60%]'>
              <Title text={level} />
              <div className='flex flex-col space-y-7'>
                <p className='text-white font-medium text-base w-[80%]'>
                  {data.plan[level]["about"]["description"].text}
                </p>
                <div className='space-y-2'>
                  <h4 className='text-red-400 font-bold text-sm'>Outcomes</h4>
                  <Outcomes outcomes={data.plan[level]["about"]["outcomes"]} />
                </div>
              </div>
            </div>
            <div className='space-y-3 w-fit'>
              <h4 className='text-red-400 font-bold text-sm '>Courses</h4>
              <Subjects subjects={data.plan[level]["subjects"]} level={level} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RoadmapOutlinePage;

const Title = ({ text }) => {
  return (
    <h2 className='text-5xl font-bold text-red-400 '>
      {capitalizeFirstLetter(text)}
    </h2>
  );
};

const Outcomes = ({ outcomes }) => {
  return (
    <>
      {outcomes.map((outcome, i) => {
        return (
          <div key={i}>
            <p className='text-white font-medium text-base'>- {outcome.text}</p>
          </div>
        );
      })}
    </>
  );
};

const Subjects = ({ subjects, level }) => {
  return (
    <>
      {subjects.map((subject, i) => {
        return (
          <div key={i}>
            <Link
              relative='path'
              to={`${level}/${subject.text}`}
              className='text-blue-500 font-medium text-base hover:text-blue-200'
            >
              {subject.text}
            </Link>
          </div>
        );
      })}
    </>
  );
};
