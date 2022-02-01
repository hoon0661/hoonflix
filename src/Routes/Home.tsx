import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getAllTrendingDaily,
  getAllTrendingWeekly,
  getMovies,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "./utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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

const Banner = styled.div<{ bgphoto: string }>`
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

const Slider = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 95%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const SlideButton = styled.div<{ isLeft: boolean }>`
  background-color: rgba(0, 0, 0, 0.3);
  color: ${(props) => props.theme.white.darker};
  width: 2.5%;
  height: 200px;
  position: absolute;
  ${(props) => (props.isLeft ? { left: 0 } : { right: 0 })}
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.black.lighter};
  }
`;

const rowVariants = {
  entry: (goingBack: boolean) => ({
    x: goingBack ? -window.innerWidth - 5 : window.innerWidth + 5,
  }),
  center: {
    x: 0,
  },
  exit: (goingBack: boolean) => ({
    x: goingBack ? window.innerWidth + 5 : -window.innerWidth - 5,
  }),
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const { data: weekly, isLoading: isLoadingWeekly } =
    useQuery<IGetMoviesResult>(["weekly", "trending"], getAllTrendingWeekly);
  const { data: daily, isLoading: isLoadingDaily } = useQuery<IGetMoviesResult>(
    ["daily", "trending"],
    getAllTrendingDaily
  );
  const [indexWeekly, setIndexWeekly] = useState(0);
  const [indexDaily, setIndexDaily] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [goingBack, setGoingBack] = useState(false);
  const changeIndex = (back: boolean, isWeekly: boolean) => {
    if (weekly) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = weekly.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      if (!back) {
        setGoingBack(false);
        if (isWeekly) {
          setIndexWeekly((prev) => (prev === maxIndex ? 0 : prev + 1));
        } else {
          setIndexDaily((prev) => (prev === maxIndex ? 0 : prev + 1));
        }
      } else {
        setGoingBack(true);
        if (isWeekly) {
          setIndexWeekly((prev) => (prev === 0 ? maxIndex : prev - 1));
        } else {
          setIndexDaily((prev) => (prev === 0 ? maxIndex : prev - 1));
        }
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    weekly?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  return (
    <Wrapper>
      {isLoadingWeekly ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(weekly?.results[0].backdrop_path || "")}
          >
            <Title>{weekly?.results[0].title}</Title>
            <Overview>{weekly?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={goingBack}
            >
              <SlideButton
                isLeft={true}
                onClick={() => changeIndex(true, true)}
              >
                <FontAwesomeIcon icon={faChevronLeft} size="2x" />
              </SlideButton>
              <Row
                custom={goingBack}
                variants={rowVariants}
                initial="entry"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={indexWeekly}
              >
                {weekly?.results
                  .slice(1)
                  .slice(offset * indexWeekly, offset * indexWeekly + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + "weekly"}
                      key={movie.id + "weekly"}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SlideButton
                isLeft={false}
                onClick={() => changeIndex(false, true)}
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </SlideButton>
            </AnimatePresence>
          </Slider>

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
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
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
