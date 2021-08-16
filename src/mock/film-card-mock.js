import dayjs from 'dayjs';

function getRandomInt (min, max){
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
}

const getRandomArrayElement = (array) => array[getRandomInt(0, array.length - 1)];

const getRandomLengthArray = (array, maxLength) => {
  const arr = new Array(Math.min(getRandomInt(1, array.length -1), maxLength));
  for (let index =0; index <arr.length; index ++){
    let value= getRandomArrayElement(array);
    while(arr.indexOf(value) >= 0){
      value= getRandomArrayElement(array);
    }
    arr[index ] = value;
  }
  return arr;
};

const MOVIE_TITLES = ['begin', 'ironman', 'world', 'hulk', 'spiderman', 'batman', 'superman', 'aquaman', 'cars', 'water', 'love store', 'world of war', 'warcraft', 'sherlock'];
const DESCRIPTION = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.' ,
  'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',' Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.'];
const MAX_LENGTH_DESCRIPTION = 5;
const COMMENT_EMOTION = ['smile', 'sleeping', 'puke', 'angry'];
const POSTERS = [
  '/images/posters/made-for-each-other.png',
  '/images/posters/popeye-meets-sinbad.png',
  '/images/posters/sagebrush-trail.jpg',
  '/images/posters/santa-claus-conquers-the-martians.jpg',
  '/images/posters/the-dance-of-life.jpg',
  '/images/posters/the-great-flamarion.jpg',
  '/images/posters/the-man-with-the-golden-arm.jpg',
];

const generateComment = () => ({
  id: getRandomInt(0,100),
  author: 'Ilya O\'Reilly',
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  date: dayjs().format('YYYY/MM/D HH:mm'),
  emotion: getRandomArrayElement(COMMENT_EMOTION),
});

const generateFilmCard = () => ({
  id: getRandomInt(0,100),
  comments: new Array(getRandomInt(0,5)).fill().map(generateComment),
  filmInfo: {
    title: getRandomArrayElement(MOVIE_TITLES),
    alternativeTitle: '',
    rating: getRandomInt(2,10),
    poster: getRandomArrayElement(POSTERS),
    ageRating: 0,
    director: 'Tom Ford',
    writers: [
      'Takeshi Kitano',
    ],
    actors: [
      'Morgan Freeman',
    ],
    release: {
      date: dayjs().format('D/MMMM/YYYY'),
      releaseCountry: 'Finland',
    },
    runtime: 77,
    genre: [
      'Comedy',
    ],
    description: getRandomLengthArray(DESCRIPTION,MAX_LENGTH_DESCRIPTION),
  },
  userDetails: {
    isWatchlist: Boolean(getRandomInt(0, 1)),
    isAlreadyWatched: Boolean(getRandomInt(0, 1)),
    watchingDate: dayjs().format('D/MMMM/YYYY'),
    isFavorite: Boolean(getRandomInt(0, 1)),
  },
});

export {generateFilmCard};
