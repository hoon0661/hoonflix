import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getTvDetail, getVideoForTv, IGetTvDetail, IGetVideos } from "../api";
import { makeImagePath } from "../Routes/utils";
import YoutubeEmbed from "./YoutubeEmbed";

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 32px;
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

function TvDetail() {
  const bigContentMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const contentId = bigContentMatch?.params.tvId;

  const { data, isLoading } = useQuery<IGetTvDetail>(
    ["content", "detail"],
    () => getTvDetail(contentId)
  );

  const { data: videos, isLoading: isVideosLoading } = useQuery<IGetVideos>(
    ["content", "videos"],
    () => getVideoForTv(contentId)
  );

  let embedId = "";
  if (!isVideosLoading && videos?.results) {
    for (let i = 0; i < videos.results.length; i++) {
      let video = videos.results[i];
      if (video.type === "Trailer" && video.site === "YouTube") {
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
      {isLoading || isVideosLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {/* <BigCover
            key={contentId}
            style={{
              backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                data?.backdrop_path || "",
                "w500"
              )})`,
            }}
          /> */}
          <YoutubeEmbed embedId={embedId} />
          <BigTitle>{data?.name}</BigTitle>
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
          </InfoArea>
        </>
      )}
    </>
  );
}

export default TvDetail;
