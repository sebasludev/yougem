export const TextInput = ({ handleChange, handleSubmit, value }) => {
  return (
    <form className='w-full h-fit' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Chat'
        className='w-full mt-3 px-5 py-2 bg-black border-2 border-blue-white text-white'
        value={value}
        onChange={handleChange}
      />
    </form>
  );
};
