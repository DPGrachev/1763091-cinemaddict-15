import AbstractView from './abstract';

const createMovieCountTemplate = (allMovies) => (
  `<p>${allMovies ? allMovies.length : '0'} movies inside</p>`
);

class MovieCount extends AbstractView {
  constructor(allMovies){
    super();
    this._allMovies = allMovies;
  }

  getTemplate() {
    return createMovieCountTemplate(this._allMovies);
  }
}

export default MovieCount;
