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
import TvDetail from "../Components/TvDetail";
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
const TODAY = "today";
const ONTHEAIR = "onTheAir";
const TOP_RATED = "topRated";
const POPULAR = "popular";
const TV = "tv";
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

          <Slider
            category={TV}
            dataTitle="On The Air"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={ONTHEAIR}
            index={indexOnTheAir}
            data={onTheAir}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

          <Slider
            category={TV}
            dataTitle="Today's TV Shows"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={TODAY}
            index={indexToday}
            data={today}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

          <Slider
            category={TV}
            dataTitle="Top Rated TV Shows"
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
            category={TV}
            dataTitle="Popular TV Shows"
            toggleLeaving={toggleLeaving}
            goingBack={goingBack}
            changeIndex={changeIndex}
            dataType={POPULAR}
            index={indexPopular}
            data={popular}
            offset={offset}
            onBoxClicked={onBoxClicked}
          />

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
                  {clickedTv && (
                    <TvDetail
                      contentId={clickedTv}
                      onBoxClicked={onBoxClicked}
                    />
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
export default Tv;
