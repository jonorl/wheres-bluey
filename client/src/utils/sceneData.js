// If more scenarios are to be added, this is the place to add the assets and names
import socksImage from '../assets/bluey-room-socks.jpg';
import muffinImage from '../assets/bluey-room-muffin.jpg';
import bobBilbyImage from '../assets/bluey-room-bob-bilby.jpg';
import blueyRoom from '../assets/bluey-room-1440p.jpg';

import bingoImage from '../assets/bluey-beach-bingo.jpg';
import blueyImage from '../assets/bluey-beach-bluey.jpg';
import pelicanImage from '../assets/bluey-beach-pelican.jpg';
import blueyBeach from '../assets/bluey-beach-1440p.jpg';

import judoImage from '../assets/bluey-street-judo.jpg';
import luckyImage from '../assets/bluey-street-lucky.jpg';
import luckysDadImage from '../assets/bluey-street-luckys-dad.jpg';
import blueyStreet from '../assets/bluey-street.jpg';

const sceneData = {
  playroom: {
    background: blueyRoom,
    characters: {
      Socks: socksImage,
      Muffin: muffinImage,
      'Bob Bilby': bobBilbyImage,
    },
  },
  beach: {
    background: blueyBeach,
    characters: {
      Bingo: bingoImage,
      Bluey: blueyImage,
      Pelican: pelicanImage,
    },
  },
  street: {
    background: blueyStreet,
    characters: {
      Judo: judoImage,
      Lucky: luckyImage,
      "Lucky's dad": luckysDadImage,
    },
  },
};

export default sceneData;
