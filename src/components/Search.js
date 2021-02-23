import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { FEED_SEARCH_QUERY } from '../client/gqlQueries';
import Link from './Link';

const Search = () => {

  const [searchFilter, setSearchFilter] = useState('');

  const [executeSearch, { data, loading, error }] = useLazyQuery(FEED_SEARCH_QUERY);

  const searchFilterHandler = event => {
    setSearchFilter(event.target.value)
  };

  const searchButtonHandler = () => {
    executeSearch({
      variables: { filter: searchFilter },
      onError: error => console.log(error),
      fetchPolicy: 'cache-and-network'
    });
  };

  let links = null;
  if (data) {
    links = data.subfeed
      .map((link, index) => (
        <Link
          key={link.id}
          link={link}
          index={index}
        />)
      )
  };

  let message = null;
  if (loading) message = <p>Searching...</p>
  if (error) message = <p>{error.message + '\n Please, try again.'}</p>

  return (
    <>
      <div>
        Search {"\t"}
        <input type="text" onChange={searchFilterHandler} />
        <button onClick={searchButtonHandler} >OK</button>
      </div>
      {links || message}
    </>
  );
};

export default Search;