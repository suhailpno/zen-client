import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const MovieSearch = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [view, setView] = useState('grid');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/api/movies');
      console.log('API Response:', response.data);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format from server');
      }

      setMovies(response.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.response?.data?.message || 'Failed to fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query) => {
    try {
      if (!query || query.trim().length < 2) {
        return;
      }

      setLoading(true);
      setError(null);
      setSearching(true);

      const response = await axios.get(`/api/movies/search`, {
        params: { query: query.trim() }
      });

      console.log('Search results:', response.data);
      setMovies(response.data);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.response?.data?.message || 'Failed to search movies');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchMovies(searchQuery);
      } else {
        fetchMovies(); // Load all movies when search is empty
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const filtered = sortMovies(
      movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = genre === 'all' || movie.genre.includes(genre);
        return matchesSearch && matchesGenre;
      })
    );
    setMovies(filtered);
  };

  const sortMovies = (moviesToSort) => {
    return [...moviesToSort].sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating?.imdb || 0) - (a.rating?.imdb || 0);
        case 'releaseDate':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const MovieCard = ({ movie }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-96">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/fallback-movie-poster.jpg';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{movie.rating?.imdb?.toFixed(1) || 'N/A'}</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {movie.genre.map((g, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-sm rounded">
              {g}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-600 mb-4">
          <p>{movie.duration}</p>
          <p>{movie.language}</p>
          <p>Director: {movie.director}</p>
        </div>
        <button
          onClick={() => navigate(`/booking/${movie._id}`)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-center py-8">Loading movies...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>{error}</p>
        <button 
          onClick={fetchMovies}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {searching && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Searching movies...</p>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="all">All Genres</option>
            <option value="Action">Action</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            {/* Add more genres */}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="rating">Rating</option>
            <option value="releaseDate">Release Date</option>
            <option value="title">Title</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded ${view === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Grid
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded ${view === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            List
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-8">No movies found</div>
      ) : (
        <div className={`grid ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'} gap-6`}>
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieSearch; 