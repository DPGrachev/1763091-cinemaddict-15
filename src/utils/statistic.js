import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);

const TypeOfDateRange = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const watchedFilmsInDateRange = (films, dateFrom, dateTo, currentInput) => {
  if(currentInput === TypeOfDateRange.ALL_TIME){
    return films.filter((film) => dayjs(film.userDetails.watchingDate).isSameOrBefore(dateTo));
  }
  if(currentInput === TypeOfDateRange.TODAY){
    return films.filter((film) => dayjs(film.userDetails.watchingDate).isSame(dateTo, 'day'));
  }
  return films.filter((film) =>
    dayjs(film.userDetails.watchingDate).isSame(dateFrom , 'day') ||
    dayjs(film.userDetails.watchingDate).isBetween(dateFrom, dateTo) ||
    dayjs(film.userDetails.watchingDate).isSame(dateTo, 'day'),
);
};

export { watchedFilmsInDateRange};
