import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getSimilarTvs,
  getTvDetail,
  getVideoForTv,
  IGetSimilarTvsResult,
  IGetTvDetail,
  IGetVideos,
} from "../api";
import { makeImagePath } from "../utils";
import YoutubeEmbed from "./YoutubeEmbed";

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
  a:hover {
    color: ${(props) => props.theme.white.darker};
  }
`;

const InfoArea = styled.div`
  width: 100%;
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

const SimilarContents = styled.div`
  padding: 20px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
`;

const SimilarContentBox = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  &:nth-child(odd) {
    transform-origin: center left;
  }
  &:nth-child(even) {
    transform-origin: center right;
  }
`;

const SubHeader = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 24px;
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

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.2,
    y: -40,
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

const TvDetail = (props: any) => {
  const { data, isLoading } = useQuery<IGetTvDetail>(
    ["content", "detail"],
    () => getTvDetail(props.contentId)
  );

  const { data: videos, isLoading: isVideosLoading } = useQuery<IGetVideos>(
    ["content", "videos"],
    () => getVideoForTv(props.contentId)
  );

  const { data: similar, isLoading: isSimilarLoading } =
    useQuery<IGetSimilarTvsResult>(["content", "similar"], () =>
      getSimilarTvs(props.contentId)
    );

  let embedId = "";
  if (!isVideosLoading && videos?.results) {
    for (let i = 0; i < videos.results.length; i++) {
      let video = videos.results[i];
      if (video.site === "YouTube") {
        embedId = video.key;
        break;
      }
    }
  }
  let seasonSuffix = "";
  if (data?.number_of_seasons) {
    seasonSuffix = data?.number_of_seasons > 1 ? "Seasons" : "Season";
  }

  return (
    <>
      {isLoading || isVideosLoading || isSimilarLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {embedId ? (
            <YoutubeEmbed embedId={embedId} />
          ) : (
            <BigCover
              key={props.contentId}
              style={{
                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                  data?.backdrop_path || data?.poster_path || "",
                  "w500"
                )})`,
              }}
            />
          )}

          <BigTitle>
            <a href={data?.homepage} target="_blank">
              {data?.name}
            </a>
          </BigTitle>
          <InfoArea>
            <InfoHeader>
              <SmallCard>{data?.first_air_date}</SmallCard>
              <SmallCard>
                {data?.number_of_seasons} {seasonSuffix}
              </SmallCard>
              <SmallCard>
                <FontAwesomeIcon icon={faStar} color="#fbc531" />
                {data?.vote_average}
              </SmallCard>
              <SmallCard>{data?.original_language}</SmallCard>
              {data?.genres.map((genre) => (
                <SmallCard key={genre.id}>#{genre.name}</SmallCard>
              ))}
            </InfoHeader>
            <Logos>
              {data?.production_companies.map(
                (item) =>
                  item.logo_path && (
                    <Logo
                      src={makeImagePath(item.logo_path || "")}
                      alt="logo"
                      key={item.name}
                    />
                  )
              )}
            </Logos>
            <BigOverview>{data?.overview}</BigOverview>
            {similar?.results.length ? (
              <SubHeader>Similar TV Shows</SubHeader>
            ) : null}
            <SimilarContents>
              {similar?.results.slice(0, 6).map((item) => (
                <SimilarContentBox
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  key={item.id}
                  bgphoto={makeImagePath(
                    item.backdrop_path || item.poster_path,
                    "w500"
                  )}
                >
                  <Info variants={infoVariants}>
                    <h4>{item.name}</h4>
                  </Info>
                </SimilarContentBox>
              ))}
            </SimilarContents>
          </InfoArea>
        </>
      )}
    </>
  );
};

export default TvDetail;
