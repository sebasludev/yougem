import { NavLink, Outlet, useParams } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";

function LearnLayoutWithSidebar() {
  const { subject, id } = useParams();
  const [data] = useLocalStorage("navbar");
  if (!subject || id)
    return (
      <div className='px-64 py-20 w-screen bg-black'>
        <Outlet />
      </div>
    );
  return (
    <div className='flex h-screen '>
      <nav className='overflow-y-auto flex-grow shrink-0 w-fit pl-5 pr-10 py-10 border-r-2 border-white  text-white '>
        <div className='space-y-10'>
          <h6 className='text-white  font-black text-xl '>
            {JSON.parse(data).prompt}
          </h6>
          <div className='space-y-5'>
            {JSON.parse(data).plan.map((level, levelIndex) => (
              <div key={levelIndex} className='pb-4   rounded-2xl'>
                <h2 className='text-red-400 text-sm font-bold mb-2 '>
                  {Object.keys(level)[0]}
                </h2>
                <ul className='space-y-4 flex flex-col'>
                  {level[Object.keys(level)[0]].map((topic, topicIndex) => (
                    <NavLink
                      key={topicIndex}
                      replace
                      to={`${Object.keys(level)[0]}/${topic.text}`}
                      className={({ isActive }) =>
                        `w-[200px] hover:text-blue-500  ${
                          isActive
                            ? "text-blue-500 border-2 border-blue-500 px-2 py-4 font-bold text-lg  pointer-events-none"
                            : "font-normal text-white"
                        }`
                      }
                    >
                      {topic.text}
                    </NavLink>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
}

export default LearnLayoutWithSidebar;
