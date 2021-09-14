import FilmsModel from '../model/films.js';
import { isOnline } from '../utils/common.js';

const getSyncedFilms = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.film);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isChange = false;
  }

  getMovieIsChange(){
    return this._isChange;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);
          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  getComments(film) {
    if (isOnline()) {
      return this._api.getComments(film);
    }

    return Promise.reject(new Error('Open popup failed'));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, FilmsModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }
    this._isChange = true;
    this._store.setItem(movie.id, FilmsModel.adaptToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  addNewComment(movie) {
    if (isOnline()) {
      return this._api.addNewComment(movie)
        .then((newMovie) => {
          this._store.setItem(newMovie.id, FilmsModel.adaptToServer(newMovie));
          return newMovie;
        });
    }

    return Promise.reject(new Error('Add new comment failed'));
  }

  deleteComment(film) {
    if (isOnline()) {
      return this._api.deleteComment(film)
        .then(() => this._store.setItem(film.id, FilmsModel.adaptToServer(film)));
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());
      this._isChange = false;

      return this._api.sync(storeFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);
          const items = createStoreStructure([...updatedFilms]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}

export default Provider;
