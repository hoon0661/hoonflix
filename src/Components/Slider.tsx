import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { makeImagePath } from "../utils";

const Area = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  top: -100px;
  margin-bottom: 300px;
  &:last-child {
    margin-bottom: 0;
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

const TV = "tv";
const MOVIE = "movie";

const Slider = ({
  category,
  dataTitle,
  toggleLeaving,
  goingBack,
  changeIndex,
  dataType,
  index,
  data,
  offset,
  onBoxClicked,
}: any) => {
  return (
    <Area>
      <Subheader>{dataTitle}</Subheader>
      <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        custom={goingBack}
      >
        <SlideButton
          key="leftButton"
          isLeft={true}
          onClick={() => changeIndex(true, dataType)}
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
          key={index}
        >
          {data?.results
            .slice(1)
            .slice(offset * index, offset * index + offset)
            .map((item: any) => (
              <Box
                layoutId={item.id + dataType}
                key={item.id + dataType}
                whileHover="hover"
                initial="normal"
                variants={boxVariants}
                onClick={() => onBoxClicked(item.id, dataType)}
                transition={{ type: "tween" }}
                bgphoto={makeImagePath(
                  item.backdrop_path || item.poster_path,
                  "w500"
                )}
              >
                <Info variants={infoVariants}>
                  <h4>{category === MOVIE ? item.title : item.name}</h4>
                </Info>
              </Box>
            ))}
        </Row>
        <SlideButton
          key="rightButton"
          isLeft={false}
          onClick={() => changeIndex(false, dataType)}
        >
          <FontAwesomeIcon icon={faChevronRight} size="2x" />
        </SlideButton>
      </AnimatePresence>
    </Area>
  );
};

export default Slider;
