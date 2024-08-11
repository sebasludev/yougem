import { Outlet } from "react-router-dom";

function LearningLayout() {
  return (
    <div className='h-screen'>
      <div className='h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default LearningLayout;
