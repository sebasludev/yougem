import { Outlet } from "react-router-dom";

function GlobalLayout() {
  return (
    <div className='w-full h-full relative '>
      <Outlet />
      <div className='absolute bottom-0 left-0 text-sm text-white  w-screen flex justify-center'>
        <p>
          <span>2024</span> Made by <span>Sebastian L.Z,</span> Made in 🇨🇱 🇪🇨,{" "}
          <span>This app is powered by </span> <span>Google Gemini</span>{" "}
        </p>
      </div>
    </div>
  );
}

export default GlobalLayout;
