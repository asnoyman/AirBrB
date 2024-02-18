import React from 'react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PropTypes from 'prop-types';

const Carousel = ({ images, title }) => {
  const [currImg, setCurrImg] = React.useState(0);
  const carousel = {
    height: '200px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const carouselInnerPhoto = {
    maxWidth: '200px',
    maxHeight: '200px',
    objectFit: 'contain',
  }

  const carouselInner = {
    width: '200px',
    height: '200px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const side = {
    cursor: 'pointer',
    margin: '0 10px',
  }

  return (
    <div style={carousel}>
      <div
        id='prev-photo-button'
        style={side}
        onClick={() => {
          currImg > 0 ? setCurrImg(currImg - 1) : setCurrImg(images.length - 1);
        }}>
        <KeyboardArrowLeftIcon />
      </div>
      <div style={carouselInner}>
        {!((images[currImg].img).includes('www.youtube.com'))
          ? <img
            src={`${images[currImg].img}`}
            alt={`Property image of ${title}`}
            style={carouselInnerPhoto}
          />
          : <iframe
            id="video"
            width="200"
            height="200"
            src={`${images[currImg].img}`}
            frameBorder="0"
            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />}
      </div>
      <div
        id='next-photo-button'
        style={side}
        onClick={() => {
          currImg < images.length - 1 ? setCurrImg(currImg + 1) : setCurrImg(0);
        }}>
        <KeyboardArrowRightIcon />
      </div>
    </div>
  )
};

Carousel.propTypes = {
  images: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default Carousel;
