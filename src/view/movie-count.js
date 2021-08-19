import { createElement } from '../utils';

const createMovieCountTemplate = (allMovies) => (
  `<section class="footer__statistics">
  <p>${allMovies.length} movies inside</p>
  </section>`
);

class MovieCount {
  constructor(allMovies){
    this._allMovies = allMovies;
    this._element = null;
  }

  getTemplate() {
    return createMovieCountTemplate(this._allMovies);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default MovieCount;
