import React from 'react';

const Filters = ({ filter, setFilter, genre, setGenre }) => {
  return (
    <div className="flex gap-4 mb-4">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="now_showing">Now Showing</option>
        <option value="coming_soon">Coming Soon</option>
      </select>

      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All Genres</option>
        <option value="Action">Action</option>
        <option value="Adventure">Adventure</option>
        <option value="Comedy">Comedy</option>
        <option value="Drama">Drama</option>
        <option value="Sci-Fi">Sci-Fi</option>
      </select>
    </div>
  );
};

export default Filters; 