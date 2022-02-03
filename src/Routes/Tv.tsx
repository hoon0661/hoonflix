import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getTvsAiringToday,
  getTVsOnTheAir,
  getTvsPopular,
  getTvsTopRated,
  IGetTvsResult,
} from "../api";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import TvDetail from "../Components/TvDetail";

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

const Slider = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  top: -100px;
  margin-bottom: 300px;
  &:last-child {
    margin-bottom: 0;
  }
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
  width: 55vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow-y: auto;
  background-color: ${(props) => props.theme.black.lighter};
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

const Subheader = styled.div`
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  padding-left: 2.5%;
  width: 100%;
  position: relative;
  bottom: 35px;
  font-size: 24px;
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
const TODAY = "today";
const ONTHEAIR = "onTheAir";
const TOP_RATED = "topRated";
const POPULAR = "popular";
function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const [indexToday, setIndexToday] = useState(0);
  const [indexOnTheAir, setIndexOnTheAir] = useState(0);
  const [indexTopRated, setIndexTopRated] = useState(0);
  const [indexPopular, setIndexPopular] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [goingBack, setGoingBack] = useState(false);
  const [dataType, setDataType] = useState("");
  const { data: today, isLoading: isLoadingToday } = useQuery<IGetTvsResult>(
    ["tv", "today"],
    getTvsAiringToday
  );
  const { data: onTheAir, isLoading: isLoadingOnTheAir } =
    useQuery<IGetTvsResult>(["tv", "onTheAir"], getTVsOnTheAir);
  const { data: topRated, isLoading: isLoadingTopRated } =
    useQuery<IGetTvsResult>(["tv", "topRated"], getTvsTopRated);
  const { data: popular, isLoading: isLoadingPopular } =
    useQuery<IGetTvsResult>(["tv", "popular"], getTvsPopular);

  const changeIndex = (back: boolean, type: string) => {
    if (onTheAir && today && topRated && popular) {
      if (leaving) return;
      toggleLeaving();
      const totalOnTheAir = onTheAir.results.length - 1;
      const maxIndexForOnTheAir = Math.floor(totalOnTheAir / offset) - 1;

      const totalToday = today.results.length;
      const maxIndexForToday = Math.floor(totalToday / offset) - 1;

      const totalTopRated = topRated.results.length;
      const maxIndexForTopRated = Math.floor(totalTopRated / offset) - 1;

      const totalPopular = popular.results.length;
      const maxIndexForPopular = Math.floor(totalPopular / offset) - 1;
      if (!back) {
        setGoingBack(false);
        if (type === ONTHEAIR) {
          setIndexOnTheAir((prev) =>
            prev === maxIndexForOnTheAir ? 0 : prev + 1
          );
        }
        if (type === TODAY) {
          setIndexToday((prev) => (prev === maxIndexForToday ? 0 : prev + 1));
        }
        if (type === TOP_RATED) {
          setIndexTopRated((prev) =>
            prev === maxIndexForTopRated ? 0 : prev + 1
          );
        }
        if (type === POPULAR) {
          setIndexPopular((prev) =>
            prev === maxIndexForPopular ? 0 : prev + 1
          );
        }
      } else {
        setGoingBack(true);
        if (type === ONTHEAIR) {
          setIndexOnTheAir((prev) =>
            prev === 0 ? maxIndexForOnTheAir : prev - 1
          );
        }
        if (type === TODAY) {
          setIndexToday((prev) => (prev === 0 ? maxIndexForToday : prev - 1));
        }
        if (type === TOP_RATED) {
          setIndexTopRated((prev) =>
            prev === 0 ? maxIndexForTopRated : prev - 1
          );
        }
        if (type === POPULAR) {
          setIndexPopular((prev) =>
            prev === 0 ? maxIndexForPopular : prev - 1
          );
        }
      }
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId?: number, dataType?: string) => {
    setDataType(dataType || "");
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");
  const clickedTv = bigTvMatch?.params.tvId;

  return (
    <Wrapper>
      {isLoadingOnTheAir ||
      isLoadingPopular ||
      isLoadingToday ||
      isLoadingTopRated ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            layoutId={onTheAir?.results[0].id + ONTHEAIR}
            bgphoto={makeImagePath(onTheAir?.results[0].backdrop_path || "")}
            onClick={() => onBoxClicked(onTheAir?.results[0].id, ONTHEAIR)}
          >
            <Title>{onTheAir?.results[0].name}</Title>
            <Overview>{onTheAir?.results[0].overview}</Overview>
          </Banner>

          <Slider>
            <Subheader>On The Air</Subheader>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={goingBack}
            >
              <SlideButton
                key="leftButton"
                isLeft={true}
                onClick={() => changeIndex(true, ONTHEAIR)}
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
                key={indexOnTheAir}
              >
                {onTheAir?.results
                  .slice(1)
                  .slice(
                    offset * indexOnTheAir,
                    offset * indexOnTheAir + offset
                  )
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ONTHEAIR}
                      key={tv.id + ONTHEAIR}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, ONTHEAIR)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SlideButton
                key="rightButton"
                isLeft={false}
                onClick={() => changeIndex(false, ONTHEAIR)}
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </SlideButton>
            </AnimatePresence>
          </Slider>

          <Slider>
            <Subheader>Top Rated TV Shows</Subheader>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={goingBack}
            >
              <SlideButton
                key="leftButton"
                isLeft={true}
                onClick={() => changeIndex(true, TOP_RATED)}
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
                key={indexTopRated}
              >
                {topRated?.results
                  .slice(1)
                  .slice(
                    offset * indexTopRated,
                    offset * indexTopRated + offset
                  )
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + TOP_RATED}
                      key={tv.id + TOP_RATED}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, TOP_RATED)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SlideButton
                key="rightButton"
                isLeft={false}
                onClick={() => changeIndex(false, TOP_RATED)}
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </SlideButton>
            </AnimatePresence>
          </Slider>

          <Slider>
            <Subheader>Airing Today</Subheader>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={goingBack}
            >
              <SlideButton
                key="leftButton"
                isLeft={true}
                onClick={() => changeIndex(true, TODAY)}
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
                key={indexToday}
              >
                {today?.results
                  .slice(1)
                  .slice(offset * indexToday, offset * indexToday + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + TODAY}
                      key={tv.id + TODAY}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, TODAY)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SlideButton
                key="rightButton"
                isLeft={false}
                onClick={() => changeIndex(false, TODAY)}
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </SlideButton>
            </AnimatePresence>
          </Slider>

          <Slider>
            <Subheader>Popular TV Shows</Subheader>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={goingBack}
            >
              <SlideButton
                key="leftButton"
                isLeft={true}
                onClick={() => changeIndex(true, POPULAR)}
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
                key={indexPopular}
              >
                {popular?.results
                  .slice(1)
                  .slice(offset * indexPopular, offset * indexPopular + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + POPULAR}
                      key={tv.id + POPULAR}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id, POPULAR)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(
                        tv.backdrop_path || tv.poster_path,
                        "w500"
                      )}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SlideButton
                key="rightButton"
                isLeft={false}
                onClick={() => changeIndex(false, POPULAR)}
              >
                <FontAwesomeIcon icon={faChevronRight} size="2x" />
              </SlideButton>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />

                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId + dataType}
                >
                  {clickedTv && <TvDetail tvId={clickedTv} />}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
