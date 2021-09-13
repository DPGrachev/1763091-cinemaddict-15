import FilmsModel from '../model/movies';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(film){
    return this._load({url: `comments/${film.id}`})
      .then(Api.toJSON);
  }

  updateMovie(movie) {
    return this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addNewComment(movie) {
    return this._load({
      url: `comments/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(movie.newComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then((response) => response = response.movie)
      .then(FilmsModel.adaptToClient);
  }

  deleteComment(film) {
    return this._load({
      url: `comments/${film.commentToDelete.id}`,
      method: Method.DELETE,
    });
  }

  sync(film) {
    return this._load({
      url: '/movies/sync',
      method: Method.POST,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}

export default Api;
