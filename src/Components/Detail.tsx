import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail } from "../api";
import { makeImagePath } from "../Routes/utils";

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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
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

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Detail() {
  const history = useHistory();
  const onOverlayClick = () => history.push("/");
  const { scrollY } = useViewportScroll();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const movieId = bigMovieMatch?.params.movieId;
  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["movie", "detail"],
    () => getMovieDetail(movieId)
  );
  return (
    <>
      {isLoading ? null : (
        <>
          <BigCover
            key={movieId}
            style={{
              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                data?.backdrop_path || "",
                "w500"
              )})`,
            }}
          />
          <BigTitle>{data?.title}</BigTitle>
          <BigOverview>{data?.overview}</BigOverview>
        </>
      )}
    </>
  );
}

export default Detail;
