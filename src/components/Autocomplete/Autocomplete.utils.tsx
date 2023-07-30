export const highlightText = (initialText: string, inputValue: string) => {
  const index = initialText.toLowerCase().indexOf(inputValue.toLowerCase());
  if (index >= 0) {
    return (
      <>
        {initialText.substring(0, index)}
        <span className='highlight'>{initialText.substring(index, index + inputValue.length)}</span>
        {initialText.substring(index + inputValue.length)}
      </>
    );
  }
  return initialText;
};
