import { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import styles from './App.module.css';

export default function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleSearch = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);
        setMovies([]);
        setSelectedMovie(null);
        
        try {
            const results = await fetchMovies(query);

            if (results.length === 0) {
                toast.error('No movies found for your request.');
            }

            setMovies(results);
        } catch (err) {
            const ErrorMessage = err instanceof Error ? err.message : 'Failed to fetch movies';
            setError(ErrorMessage);
            toast.error(ErrorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSelectMovie = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);
    
    return (
        <div className={styles.app}>
            <Toaster position="top-center" />
        
            <SearchBar onSubmit={handleSearch} />
        
                {isLoading && <Loader />}
          
                {error && !isLoading && <ErrorMessage />}
          
            {!isLoading && !error && movies.length > 0 && (
                <MovieGrid movies={movies} onSelect={handleSelectMovie} />
            )}
  
            <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        </div>
    );
}