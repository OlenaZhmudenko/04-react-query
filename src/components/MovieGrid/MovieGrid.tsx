import type { Movie } from "../../types/movie";
import styles from './MovieGrid.module.css';

interface MovieGridProps {
    movies: Movie[];
    onMovieSelect: (movie: Movie) => void;
}

export default function MovieGrid({ movies, onMovieSelect }: MovieGridProps) {
    const getImageUrl = (path: string | null) =>
        path ? `https://image.tmdb.org/t/p/w500${path}` : '/placeholder-movie.jpg';

    return (
        <ul className={styles.grid}>
            {movies.map((movie) => (
                <li key={movie.id}>
                    <div className={styles.card} onClick={() => onMovieSelect(movie)}>
                        <img
                            className={styles.image}
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            loading="lazy"
                        />
                        <h2 className={styles.title}>{movie.title}</h2>
                    </div>
                </li>

            ))}
        </ul>
    );
}