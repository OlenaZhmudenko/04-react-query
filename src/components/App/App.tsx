import { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import styles from './App.module.css';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';
import type { MoviesResponse } from '../../services/movieService';

export default function App() {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

    const { data, isLoading, isError, error, isSuccess, isFetching } = useQuery<MoviesResponse, Error>({
       queryKey: ['movies', query, page],
       queryFn: () => fetchMovies(query, page),
       enabled: query.length > 0,
       placeholderData: (previousData) => previousData,
     });  

    const moviesData = data as MoviesResponse | undefined;

     useEffect(() => {
        if (isError && error) {
            const errorMessage = error.message;
            toast.error(errorMessage);
        }
     }, [isError, error]);

     useEffect(() => {
        if (isSuccess && moviesData && moviesData.results.length === 0 && query.length > 0) {
            toast.error('No movies found for your request.');
        }
     }, [isSuccess, moviesData, query]);


    const handleSearch = useCallback((searchQuery: string) => {
        setQuery(searchQuery);
        setPage(1);
    }, []);

    const handleSelectMovie = useCallback((movie: Movie) => {
        setSelectedMovie(movie);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedMovie(null);
    }, []);
    
    const handlePageChange = useCallback(({ selected }: { selected: number }) => {
        setPage(selected + 1);
    }, []);

    return (
        <div className={styles.app}>
            <Toaster position="top-center" />
        
            <SearchBar onSubmit={handleSearch} />
        
                {isLoading || isFetching && <Loader />}
          
                {isError && !isLoading && (
                    <ErrorMessage message={error?.message || 'Unknown error'} />)}
          
            {isSuccess && moviesData && moviesData.results.length > 0 && (
                <>
                <MovieGrid movies={moviesData.results} onSelect={handleSelectMovie} />

                {moviesData.total_pages > 1 && (
                    <ReactPaginate
                    pageCount={moviesData.total_pages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    forcePage={page - 1}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    nextLabel="→"
                    previousLabel="←"
                    />
                )}
  </>
            )}
            {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
            )}
        </div>
    );
    }