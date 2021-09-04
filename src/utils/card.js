import dayjs from 'dayjs';
import { getRandomInt } from './common';

const sortDateDown = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));

const sortRatingDown = (cardA, cardB) => cardB.filmInfo.rating - cardA.filmInfo.rating;

const generateDate = () => {

  const maxYearsGap = 40;
  const YearsGap = getRandomInt(-maxYearsGap, 0);

  return dayjs().add(YearsGap, 'year');
};

export {sortDateDown, sortRatingDown, generateDate};
