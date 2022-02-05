import { config } from "./config";

const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  backdrop_path: string;
  poster_path: string;
  overview: string;
  title: string;
  id: number;
}

export interface ITv {
  backdrop_path: string;
  poster_path: string;
  overview: string;
  name: string;
  id: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetSimilarMoviesResult {
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetSimilarTvsResult {
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvsResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IVideos {
  name: string;
  site: string;
  type: string;
  key: string;
}

export interface IGetVideos {
  results: IVideos[];
}

export interface IGetMovieDetail {
  homepage: string;
  original_language: string;
  title: string;
  vote_average: number;
  overview: string;
  production_companies: IProduction[];
  release_date: string;
  runtime: number;
  backdrop_path: string;
  genres: IGenre[];
  poster_path: string;
}

export interface IGetTvDetail {
  first_air_date: string;
  last_air_date: string;
  production_companies: IProduction[];
  name: string;
  original_language: string;
  vote_average: number;
  overview: string;
  number_of_seasons: number;
  id: number;
  homepage: string;
  genres: IGenre[];
  backdrop_path: string;
  poster_path: string;
}

export interface IProduction {
  logo_path: string;
  name: string;
}

export interface IGenre {
  id: number;
  name: string;
}

export interface IGetSearchResults {
  page: number;
  results: ISearchResult[];
  total_results: number;
  total_pages: number;
}

export interface ISearchResult {
  poster_path: string;
  backdrop_path: string;
  id: number;
  title?: string;
  name?: string;
  media_type: string;
}

//Movie now playing
export function getMoviesNowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Movie popular
export function getMoviesPopular() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Movie top rated
export function getMoviesTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Movie upcoming
export function getMoviesUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//TV airing today
export function getTvsAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//TV top rated
export function getTvsTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//TV on the air
export function getTVsOnTheAir() {
  return fetch(
    `${BASE_PATH}/tv/on_the_air?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//TV popular
export function getTvsPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Movie videos
export function getVideoForMovie(movieId?: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/videos?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Tv videos
export function getVideoForTv(tvId?: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}/videos?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Movie similar
export function getSimilarMovies(movieId?: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/similar?api_key=${config.MOVIE_KEY}&page=1&language=en-US`
  ).then((response) => response.json());
}

//Tv similar
export function getSimilarTvs(tvId?: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}/similar?api_key=${config.MOVIE_KEY}&page=1&language=en-US`
  ).then((response) => response.json());
}

//Movie detail
export function getMovieDetail(movieId?: string) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Tv detail
export function getTvDetail(tvId?: string) {
  return fetch(
    `${BASE_PATH}/tv/${tvId}?api_key=${config.MOVIE_KEY}&language=en-US`
  ).then((response) => response.json());
}

//Multi search
export function getSearchResults(keyword?: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${config.MOVIE_KEY}&language=en-US&page=1&query=${keyword}`
  ).then((response) => response.json());
}
