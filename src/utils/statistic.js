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

const getWatchedFilmsInDateRange = (films, dateFrom, dateTo, currentInput) => {
  if(currentInput === TypeOfDateRange.ALL_TIME){
    return films.filter((film) => dayjs(film.userDetails.watchingDate).isSameOrBefore(dayjs()));
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

const getAllWatchedFilmsGenres = (films) => {
  const AllWatchedFilmsGenres = new Array;
  films.forEach((film) => {
    film.filmInfo.genre.forEach((genre) => AllWatchedFilmsGenres.push(genre));
  });
  return AllWatchedFilmsGenres;
};

const getUniqGenres = (genres) => [...new Set(genres)];

const countFilmsByGenres = (allGenres,genre) => allGenres.filter((item) => item === genre).length;

const getWatchedFilmsChart = (films, dateTo, dateFrom, currentInput) => {
  const WatchedFilmsChart = {
    watchedFilms : [],
    uniqGenres : [],
    filmsByGenresCount : [],
  };

  WatchedFilmsChart.watchedFilms = getWatchedFilmsInDateRange(films, dateTo, dateFrom, currentInput);
  const AllWatchedFilmsGenres = getAllWatchedFilmsGenres(WatchedFilmsChart.watchedFilms);
  const uniqGenresWithotSort = getUniqGenres(AllWatchedFilmsGenres);
  const filmsByGenresCount = uniqGenresWithotSort.map((genre) => countFilmsByGenres(AllWatchedFilmsGenres,genre));
  let genreAndCount = {};
  uniqGenresWithotSort.forEach((genre, index) => genreAndCount[genre] = filmsByGenresCount[index]);
  genreAndCount = Object.entries(genreAndCount);
  genreAndCount.sort((a, b) => b[1]-a[1]);
  genreAndCount.forEach((genre) => {
    WatchedFilmsChart.uniqGenres.push(genre[0]);
    WatchedFilmsChart.filmsByGenresCount.push(genre[1]);
  });

  return WatchedFilmsChart;
};

export { getWatchedFilmsChart};
