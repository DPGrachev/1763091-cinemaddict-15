import dayjs from 'dayjs';
import { getRandomInt } from './common';

const sortDateDown = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));

const sortRatingDown = (cardA, cardB) => cardB.filmInfo.rating - cardA.filmInfo.rating;

const generateDate = () => {

  const maxYearsGap = 30;
  const YearsGap = getRandomInt(-maxYearsGap, maxYearsGap);

  return dayjs().add(YearsGap, 'year');
};

export {sortDateDown, sortRatingDown, generateDate};
