import dayjs from 'dayjs';
import { getRandomInt } from './common';

const sortDateDown = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));

const sortRatingDown = (cardA, cardB) => cardB.filmInfo.rating - cardA.filmInfo.rating;

const generateDate = () => {

  const maxYearsGap = 10;
  const maxMonthGap = 11;
  const maxDayGap = 30;
  const yearsGap = getRandomInt(-maxYearsGap, 0);
  const monthGap = getRandomInt(-maxMonthGap, 0);
  const daysGap = getRandomInt(-maxDayGap, 0);

  return dayjs().add(yearsGap, 'year').add(monthGap, 'month').add(daysGap, 'day');
};

export {sortDateDown, sortRatingDown, generateDate};
