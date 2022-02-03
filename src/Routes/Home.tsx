import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getMoviesNowPlaying,
  getMoviesPopular,
  getMoviesTopRated,
  getMoviesUpcoming,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import MovieDetail from "../Components/MovieDetail";
import Slider from "../Components/Slider";
const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled(motion.div)<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 55vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const offset = 6;
const NOW = "now";
const POPULAR = "popular";
const TOP_RATED = "topRated";
const UPCOMING = "upcoming";
const MOVIE = "movie";
function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { data: nowPlaying, isLoading: isLoadingNowPlaying } =
    useQuery<IGetMoviesResult>(["movie", "nowPlaying"], getMoviesNowPlaying);

  const { data: popular, isLoading: isLoadingPopular } =
    useQuery<IGetMoviesResult>(["movie", "popular"], getMoviesPopular);

  const { data: topRated, isLoading: isLoadingTopRated } =
    useQuery<IGetMoviesResult>(["movie", "topRated"], getMoviesTopRated);

  const { data: upcoming, isLoading: isLoadingUpcoming } =
    useQuery<IGetMoviesResult>(["movie", "upcoming"], getMoviesUpcoming);
  const { scrollY } = useViewportScroll();
  const [indexNow, setIndexNow] = useState(0);
  const [indexPopular, setIndexPopular] = useState(0);
  const [indexTopRated, setIndexTopRated] = useState(0);
  const [indexUpcoming, setIndexUpcoming] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [goingBack, setGoingBack] = useState(false);
  const [dataType, setDataType] = useState("");

  const changeIndex = (back: boolean, type: string) => {
    if (nowPlaying && popular && topRated && upcoming) {
      if (leaving) return;
      toggleLeaving();
      const totalMoviesForNow = nowPlaying.results.length - 1;
      const maxIndexForNow = Math.floor(totalMoviesForNow / offset) - 1;

      const totalMoviesForPopular = popular.results.length;
      const maxIndexForPopular = Math.floor(totalMoviesForPopular / offset) - 1;

      const totalMoviesForTopRated = topRated.results.length;
      const maxIndexForTopRated =
        Math.floor(totalMoviesForTopRated / offset) - 1;

      const totalMoviesForUpcoming = upcoming.results.length;
      const maxIndexForUpcoming =
        Math.floor(totalMoviesForUpcoming / offset) - 1;

      if (!back) {
        setGoingBack(false);
        if (type === NOW) {
          setIndexNow((prev) => (prev === maxIndexForNow ? 0 : prev + 1));
        }
        if (type === POPULAR) {
          setIndexPopular((prev) =>
            prev === maxIndexForPopular ? 0 : prev + 1
          );
        }
        if (type === TOP_RATED) {
          setIndexTopRated((prev) =>
            prev === maxIndexForTopRated ? 0 : prev + 1
          );
        }
        if (type === UPCOMING) {
          setIndexUpcoming((prev) =>
            prev === maxIndexForUpcoming ? 0 : prev + 1
          );
        }
      } else {
        setGoingBack(true);
        if (type === NOW) {
          setIndexNow((prev) => (prev === 0 ? maxIndexForNow : prev - 1));
        }
        if (type === POPULAR) {
          setIndexPopular((prev) =>
            prev === 0 ? maxIndexForPopular : prev - 1
          );
        }
        if (type === TOP_RATED) {
          setIndexTopRated((prev) =>
            prev === 0 ? maxIndexForTopRated : prev - 1
          );
        }
        if (type === UPCOMING) {
          setIndexUpcoming((prev) =>
            prev === 0 ? maxIndexForUpcoming : prev - 1
          );
        }
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId?: number, dataType?: string) => {
    setDataType(dataType || "");
    history.push(`/movies/${movieId}`);
  };

  const onOverlayClick = () => history.push("/");
  const clickedMovie = bigMovieMatch?.params.movieId;

  return (
    <Wrapper>
      {isLoadingNowPlaying ||
      isLoadingPopular ||
      isLoadingTopRated ||
      isLoadingUpcoming ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            layoutId={nowPlaying?.results[0].id + NOW}
            onClick={() => onBoxClicked(nowPlaying?.results[0].id, NOW)}
            bgphoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>

          <Slider
            category={MOVIE}
            dataTitle="Now Playing"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={NOW}
            index={indexNow}
            data={nowPlaying}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

          <Slider
            category={MOVIE}
            dataTitle="Popular Movies"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={POPULAR}
            index={indexPopular}
            data={popular}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

          <Slider
            category={MOVIE}
            dataTitle="Top Rated Movies"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={TOP_RATED}
            index={indexTopRated}
            data={topRated}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

          <Slider
            category={MOVIE}
            dataTitle="Upcoming Movies"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={UPCOMING}
            index={indexUpcoming}
            data={upcoming}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId + dataType}
                >
                  {clickedMovie && <MovieDetail contentId={clickedMovie} />}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
