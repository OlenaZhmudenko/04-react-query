import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import styles from './MovieModal.module.css';

interface MovieModalProps {
    movie: Movie | null;
    onClose: () => void;
}

let modalRoot: HTMLElement | null = null;

export default function MovieModal({ movie, onClose }: MovieModalProps) {
    if (!modalRoot) {
        modalRoot = document.getElementById('modal-root');
        if (!modalRoot) {
            modalRoot = document.createElement('div');
            modalRoot.id = 'modal-root';
            document.body.appendChild(modalRoot);
        }
    }

    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [handleKeyDown]);

    if (!movie) return null;

    const getImageUrl = (path: string) => 
        path ? `https://image.tmdb.org/t/p/original${path}` : '/placeholder-backdrop.jpg';

    return createPortal(
        <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
                    &times;
                </button>
                <img
                    src={getImageUrl(movie.backdrop_path)}
                    alt={movie.title}
                    className={styles.image}
                />
                <div className={styles.content}>
                    <h2>{movie.title}</h2>
                    <p>{movie.overview}</p>
                    <p>
                        <strong>Release Date:</strong> {movie.release_date}
                    </p>
                    <p>
                        <strong>Rating:</strong> {movie.vote_average}/10
                    </p>
                </div>
            </div>
        </div>,
        modalRoot as HTMLElement
    );
}