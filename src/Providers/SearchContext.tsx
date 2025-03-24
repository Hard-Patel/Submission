/**
 * @format
 */
import React from 'react';

const initialProvider: ISearchContext = {
  searchFilter: '',
  setSearchFilter: (i: string) => {},
};

interface ISearchContext {
  searchFilter: string;
  setSearchFilter: (item: string) => void;
}

const SearchContext = React.createContext<ISearchContext>(initialProvider);

const SearchContextProvider = (props: any) => {
  const [searchFilter, setSearchFilter] = React.useState<string>('');

  return (
    <SearchContext.Provider value={{searchFilter, setSearchFilter}}>
      {props.children}
    </SearchContext.Provider>
  );
};

export {SearchContext, SearchContextProvider};
