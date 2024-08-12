import { Outlet } from "react-router-dom";
import SearchInput from "../../../components/search_input";

function SearchPageLayout() {
  return (
    <div className=' w-screen flex flex-col h-screen'>
      <div className='h-fit flex justify-center py-5 flex-grow-0'>
        <SearchInput place='Video' />
      </div>
      <div className='h-full'>
        <Outlet />
      </div>
    </div>
  );
}

export default SearchPageLayout;
