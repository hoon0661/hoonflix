import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import styled from "styled-components";
import {
  getMovieDetail,
  getSimilarMovies,
  getVideoForMovie,
  IGetMovieDetail,
  IGetSimilarMoviesResult,
  IGetVideos,
} from "../api";
import { makeImagePath } from "../utils";
import YoutubeEmbed from "./YoutubeEmbed";

const SubHeader = styled.div`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 24px;
`;

const BigTitle = styled(SubHeader)`
  font-size: 32px;
  padding-bottom: 0;
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

const SimilarMovies = styled.div`
  padding: 20px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
`;

const SimilarMovieBox = styled(motion.div)<{ bgphoto: string }>`
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

const MovieDetail = (props: any) => {
  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["content", "detail"],
    () => getMovieDetail(props.movieId)
  );

  const { data: videos, isLoading: isVideosLoading } = useQuery<IGetVideos>(
    ["content", "videos"],
    () => getVideoForMovie(props.movieId)
  );

  const { data: similar, isLoading: isSimilarLoading } =
    useQuery<IGetSimilarMoviesResult>(["content", "similar"], () =>
      getSimilarMovies(props.movieId)
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

  // const onBoxClicked = (movieId: string) => {
  //   history.push(`/movies/${movieId}`);
  //   /////Please set up useState to display detail from similar movie
  //   //ex useState for contentId
  // };

  return (
    <>
      {isLoading || isVideosLoading || isSimilarLoading ? (
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
          <BigTitle>
            <a href={data?.homepage} target="_blank">
              {data?.title}
            </a>
          </BigTitle>
          <InfoArea>
            <InfoHeader>
              <SmallCard>{data?.release_date}</SmallCard>
              <SmallCard>{data?.runtime} mins</SmallCard>
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
              <SubHeader>Similar Movies</SubHeader>
            ) : null}
            <SimilarMovies>
              {similar?.results.slice(0, 6).map((movie) => (
                <SimilarMovieBox
                  variants={boxVariants}
                  whileHover="hover"
                  initial="normal"
                  transition={{ type: "tween" }}
                  key={movie.id}
                  bgphoto={makeImagePath(
                    movie.backdrop_path || movie.poster_path,
                    "w500"
                  )}
                >
                  <Info variants={infoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </SimilarMovieBox>
              ))}
            </SimilarMovies>
          </InfoArea>
        </>
      )}
    </>
  );
};

export default MovieDetail;
