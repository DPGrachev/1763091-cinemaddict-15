import AbstractObserver from './abstract-observer';

class Films extends AbstractObserver{
  constructor(){
    super();
    this._films = [];
  }

  setFilms(updateType, films){
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms(){
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film){
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        filmInfo: Object.assign(
          {},
          film['film_info'],
          {
            ageRating: film['film_info']['age_rating'],
            alternativeTitle: film['film_info']['alternative_title'],
            rating: film['film_info']['total_rating'],
            release: Object.assign(
              {},
              film['film_info']['release'],
              {
                releaseCountry: film['film_info']['release']['release_country'],
              },
            ),
          },
        ),
        userDetails: Object.assign(
          {},
          film['user_details'],
          {
            isWatchlist: film['user_details']['watchlist'],
            isAlreadyWatched: film['user_details']['already_watched'],
            watchingDate: film['user_details']['already_watched'] ? film['user_details']['watching_date'] : null,
            isFavorite: film['user_details']['favorite'],
          },
        ),
      },
    );

    delete adaptedFilm['film_info'];
    delete adaptedFilm.filmInfo['age_rating'];
    delete adaptedFilm.filmInfo['alternative_title'];
    delete adaptedFilm.filmInfo['total_rating'];
    delete adaptedFilm.filmInfo['release']['release_country'];
    delete adaptedFilm['user_details'];
    delete adaptedFilm.userDetails['watchlist'];
    delete adaptedFilm.userDetails['already_watched'];
    delete adaptedFilm.userDetails['watching_date'];
    delete adaptedFilm.userDetails['favorite'];

    return adaptedFilm;
  }

  static adaptToServer(film){
    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': Object.assign(
          {},
          film.filmInfo,
          {
            'age_rating': film.filmInfo.ageRating,
            'alternative_title': film.filmInfo.alternativeTitle,
            'total_rating': film.filmInfo.rating,
            'release': Object.assign(
              {},
              film.filmInfo.release,
              {
                'release_country': film.filmInfo.release.releaseCountry,
              },
            ),
          },
        ),
        'user_details': Object.assign(
          {},
          film.userDetails,
          {
            'watchlist': film.userDetails.isWatchlist,
            'already_watched': film.userDetails.isAlreadyWatched,
            'watching_date': film.userDetails.watchingDate,
            'favorite': film.userDetails.isFavorite,
          },
        ),
      },
    );

    delete adaptedFilm.filmInfo;
    delete adaptedFilm['film_info']['ageRating'];
    delete adaptedFilm['film_info']['alternativeTitle'];
    delete adaptedFilm['film_info']['rating'];
    delete adaptedFilm['film_info']['release']['releaseCountry'];
    delete adaptedFilm.userDetails;
    delete adaptedFilm['user_details']['isWatchlist'];
    delete adaptedFilm['user_details']['isAlreadyWatched'];
    delete adaptedFilm['user_details']['watchingDate'];
    delete adaptedFilm['user_details']['isFavorite'];

    return adaptedFilm;
  }

}

export default Films;
