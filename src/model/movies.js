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
    const adaptedFilm = {
      id: film.id,
      comments: film.comments,
      filmInfo: {
        title:  film['film_info']['title'],
        alternativeTitle: film['film_info']['alternative_title'],
        rating: film['film_info']['total_rating'],
        poster: film['film_info']['poster'],
        ageRating: film['film_info']['age_rating'],
        director: film['film_info']['director'],
        writers: film['film_info']['writers'],
        actors: film['film_info']['actors'],
        release: {
          date: film['film_info']['release']['date'],
          releaseCountry: film['film_info']['release']['release_country'],
        },
        runtime:  film['film_info']['runtime'],
        genre:  film['film_info']['genre'],
        description:  film['film_info']['description'],
      },
      userDetails: {
        isWatchlist: film['user_details']['watchlist'],
        isAlreadyWatched: film['user_details']['already_watched'],
        watchingDate: film['user_details']['already_watched'] ? film['user_details']['watching_date'] : null,
        isFavorite: film['user_details']['favorite'],
      },
    };

    return adaptedFilm;
  }

  static adaptToServer(film){
    const adaptedFilm = {
      id: film.id,
      comments: film.comments.map((comment) => comment.id ? comment.id : comment),
      'film_info': {
        title:  film.filmInfo.title,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.rating,
        poster: film.filmInfo.poster,
        'age_rating': film.filmInfo.ageRating,
        director: film.filmInfo.director,
        writers: film.filmInfo.writers,
        actors: film.filmInfo.actors,
        release: {
          date: film.filmInfo.release.date,
          'release_country': film.filmInfo.release.releaseCountry,
        },
        runtime:  film.filmInfo.runtime,
        genre:  film.filmInfo.genre,
        description:  film.filmInfo.description,
      },
      'user_details': {
        'watchlist': film.userDetails.isWatchlist,
        'already_watched': film.userDetails.isAlreadyWatched,
        'watching_date': film.userDetails.watchingDate,
        'favorite': film.userDetails.isFavorite,
      },
    };

    return adaptedFilm;
  }

}

export default Films;
