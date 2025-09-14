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
    const [previousData, setPreviousData] = useState<MoviesResponse | undefined>();

    const { data, isLoading, isError, error } = useQuery<MoviesResponse, Error>({
       queryKey: ['movies', query, page],
       queryFn: () => fetchMovies(query, page),
       enabled: query.length > 0,
     });  

     useEffect(() => {
        if (data) {
            setPreviousData(data);
        }
     }, [data]);

     const displayMovies = data?.results || previousData?.results || [];
     const totalPages = data?.total_pages || previousData?.total_pages || 0;

     useEffect(() => {
        if (isError && error) {
            const errorMessage = error.message;
            toast.error(errorMessage);
        }
     }, [isError, error]);

     useEffect(() => {
        if (data && data.results.length === 0 && query.length > 0) {
            toast.error('No movies found for your request.');
        }
     }, [data, query]);


    const handleSearch = useCallback((searchQuery: string) => {
        setQuery(searchQuery);
        setPage(1);
        setPreviousData(undefined);
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
        
                {isLoading && <Loader />}
          
                {isError && !isLoading && (
                    <ErrorMessage message={error?.message || 'Unknown error'} />)}
          
            {!isLoading && !isError && displayMovies.length > 0 && (
                <>
                <MovieGrid movies={displayMovies} onMovieSelect={handleSelectMovie} />

                {totalPages > 1 && (
                    <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={handlePageChange}
                    forcePage={data ? page -1 : undefined}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    nextLabel="→"
                    previousLabel="←"
                    />
                )}
  </>
            )}
            <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
        </div>
    );
    }