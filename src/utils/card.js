import dayjs from 'dayjs';

const sortDateDown = (cardA, cardB) => dayjs(cardB.filmInfo.release.date).diff(dayjs(cardA.filmInfo.release.date));

const sortRatingDown = (cardA, cardB) => cardB.filmInfo.rating - cardA.filmInfo.rating;

export {sortDateDown, sortRatingDown};
