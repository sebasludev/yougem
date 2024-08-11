/* eslint-disable react/display-name */
import { forwardRef, useState } from "react";
import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Form, useSearchParams } from "react-router-dom";

const pathMap = {
  Video: "/search",
  Roadmap: "./learn",
  Educators: "/educators",
  Collection: "/collection",
};

const queryMaps = {
  Video: "q",
  Roadmap: "subject",
  Educators: "educators",
  Collection: "collection",
};

const placeholderMap = {
  Video: "Search Video",
  Roadmap: "Create your Learing Roadmap",
  Educators: "Create an education plan",
  Collection:
    "Search Collection from multiple subjects, example: 'I want to listen to linkin-park and System of a down'",
};

function SearchInput() {
  const [selected, setSelected] = useState("Video");
  let [searchParams] = useSearchParams();
  let [query, setQuery] = useState(searchParams.get("q"));

  return (
    <Form
      action={pathMap[selected]}
      reloadDocument={query ? true : false}
      relative='path'
      id='search-form'
      role='search'
      className='container bg-white flex-grow  py-2 px-4 border-2 border-black max-w-[70vw] flex space-x-2'
    >
      <input
        id={queryMaps[selected]}
        aria-label={placeholderMap[selected]}
        placeholder={placeholderMap[selected]}
        type='search'
        name={queryMaps[selected]}
        className='flex-grow w-full px-3'
      />
      <SelectMenu selected={selected} setSelected={setSelected} />
    </Form>
  );
}

export default SearchInput;

const SelectMenu = ({ selected, setSelected }) => {
  return (
    <Select.Root value={selected} onValueChange={setSelected}>
      <Select.Trigger
        aria-label='Options'
        className='inline-flex items-center justify-center  px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-violet11 hover:bg-red-500 hover:text-white data-[placeholder]:text-black outline-none border-2 border-black'
      >
        <Select.Value>{selected}</Select.Value>
        <Select.Icon>
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          align='start'
          sideOffset={100}
          className='overflow-auto bg-white border-2 border-black px-3 py-5 w-[200px] b'
        >
          <Select.Viewport>
            <Select.Group>
              <Select.Label hidden={true}>Search Options</Select.Label>
              <div className='flex flex-col items-center space-y-2'>
                <SelectItem value='Video'>Video</SelectItem>
                {/* <SelectItem value='Collection'>Collection</SelectItem> */}
                <SelectItem value='Roadmap'>Roadmap</SelectItem>
                {/* <SelectItem value='Educators'>Educators</SelectItem> */}
              </div>
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem = forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <Select.Item
      {...props}
      ref={forwardedRef}
      className=' w-full pl-[25px] flex items-center py-2  cursor-pointer data-[highlighted]:outline-none data-[highlighted]:bg-red-500 data-[highlighted]:text-white'
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className='absolute left-0 w-[25px] inline-flex items-center justify-center'>
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});
