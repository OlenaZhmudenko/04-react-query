import axios from "axios";
import type { Movie } from '../types/movie';


interface MoviesResponse {
    results: Movie[];
    total_pages: number;
    total_results: number;
    page: number;
}

const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

if (!TOKEN) {
    throw new Error('VITE_TMDB_TOKEN  environment variable is not set');
}

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
});

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    try {
        const response = await api.get<MoviesResponse>('/search/movie', {
            params: {
                query,
                include_adult: false,
                language: 'en-US',
                page: 1,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Failed to fetch movies:', error);
        throw error;
    }
};