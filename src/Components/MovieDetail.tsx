import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { spawn } from "child_process";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetail,
  getTvDetail,
  IGetMovieDetail,
  IGetTvDetail,
} from "../api";
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
  font-size: 32px;
  position: relative;
  top: -80px;
`;

const InfoArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  top: -100px;
  padding-top: 20px;
`;

const BigOverview = styled.p`
  padding: 20px;

  color: ${(props) => props.theme.white.lighter};
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InfoHeader = styled.div`
  width: 100%;
  padding: 20px;
  background-color: transparent;
  display: flex;
  align-items: center;
`;

const Logos = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  background-color: ${(props) => props.theme.white.darker};
  margin-left: 20px;
  margin-right: 20px;
  height: 40px;
  border-radius: 10px;
`;

const Logo = styled.img`
  width: auto;
  height: 30px;
  margin-right: 20px;
`;

const SmallCard = styled.span`
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.darker};
  border-radius: 10px;
  padding: 3px 5px;
  margin-right: 10px;
`;

function MovieDetail() {
  const bigContentMatch =
    useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const contentId = bigContentMatch?.params.movieId;

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["content", "detail"],
    () => getMovieDetail(contentId)
  );

  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <BigCover
            key={contentId}
            style={{
              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                data?.backdrop_path || "",
                "w500"
              )})`,
            }}
          />
          <BigTitle>{data?.title}</BigTitle>
          <InfoArea>
            <InfoHeader>
              <SmallCard>{data?.release_date}</SmallCard>
              <SmallCard>{data?.runtime} mins</SmallCard>
              <SmallCard>
                <FontAwesomeIcon icon={faStar} color="#fbc531" />
                {data?.vote_average}
              </SmallCard>
              <SmallCard>{data?.original_language}</SmallCard>
              {data?.genres.map((item) => (
                <SmallCard>#{item.name}</SmallCard>
              ))}
            </InfoHeader>
            <Logos>
              {data?.production_companies.map(
                (item) =>
                  item.logo_path && (
                    <Logo
                      src={makeImagePath(item.logo_path || "")}
                      alt="logo"
                    />
                  )
              )}
            </Logos>
            <BigOverview>{data?.overview}</BigOverview>
          </InfoArea>
        </>
      )}
    </>
  );
}

export default MovieDetail;
