import React from 'react';

const SearchForm = (props) => {
  return (
    <div>
      <input type="search" className="search-form" name="searchValue" onChange={props.handleChange} onKeyPress={props.handleKeyPress} placeholder="Search reviews" />
    </div>
  );
}

export default SearchForm;