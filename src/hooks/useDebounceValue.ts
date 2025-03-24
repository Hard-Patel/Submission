import React from 'react';

const useDebounceValue = (value: string, delay: number) => {
  const [debounceVal, setDebounceVal] = React.useState<string>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debounceVal;
};

export {useDebounceValue};
