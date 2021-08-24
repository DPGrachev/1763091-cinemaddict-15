import AbstractView from './abstract';

const createMovieCountTemplate = (allMovies) => (
  `<section class="footer__statistics">
  <p>${allMovies.length} movies inside</p>
  </section>`
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
