import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearchResults, IGetSearchResults } from "../api";
import MovieDetail from "../Components/MovieDetail";
import TvDetail from "../Components/TvDetail";
import { makeImagePath } from "../utils";
import Tv from "./Tv";

const Wrapper = styled.div`
  background: black;

  display: flex;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BoxArea = styled.div`
  height: 90vh;
  width: 100%;
  position: relative;
  top: 60px;
  display: grid;

  gap: 10px;
  padding: 0 20px;
`;

const Cards = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const Card = styled(motion.div)<{ bgphoto: string }>`
  height: auto;
  width: 100%;
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  cursor: pointer;
  border-radius: 20px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.veryDark};
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
  overflow-x: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const cardVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      delay: 0.2,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.2,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const TV = "tv";
const MOVIE = "movie";

function Search() {
  const location = useLocation();
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const bigMovieMatch = useRouteMatch<{ contentId: string }>(
    "/search/movie/:contentId"
  );
  const bigTvMatch = useRouteMatch<{ contentId: string }>(
    "/search/tv/:contentId"
  );
  const { data, isLoading } = useQuery<IGetSearchResults>(
    ["searchResults", keyword],
    () => getSearchResults(keyword || "")
  );

  const onBoxClicked = (contentId: number, type: string) => {
    history.push(`/search/${type}/${contentId}?keyword=${keyword}`);
  };

  const onOverlayClick = () => {
    history.push(`/search?keyword=${keyword}`);
  };

  const clickedContent =
    bigMovieMatch?.params.contentId || bigTvMatch?.params.contentId;

  const contents = data?.results.filter(
    (item) => item.media_type === TV || item.media_type === MOVIE
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <BoxArea>
            <Cards>
              {contents?.slice(0, 14).map((content) => (
                <Card
                  layoutId={content.id + ""}
                  key={content.id}
                  bgphoto={makeImagePath(
                    content.poster_path || content.backdrop_path,
                    "w500"
                  )}
                  variants={cardVariants}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  onClick={() => onBoxClicked(content.id, content.media_type)}
                >
                  <Info variants={infoVariants}>
                    <h4>{content.title || content.name}</h4>
                  </Info>
                </Card>
              ))}
            </Cards>
          </BoxArea>
          <AnimatePresence>
            {bigMovieMatch || bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={clickedContent}
                >
                  {bigMovieMatch ? (
                    <MovieDetail
                      contentId={clickedContent}
                      onBoxClicked={onBoxClicked}
                    />
                  ) : (
                    <TvDetail
                      contentId={clickedContent}
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

export default Search;
