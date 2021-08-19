import { createElement } from '../utils';

const createSortFilmsTemplate = () => (
  `<ul class="sort">
  <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
  <li><a href="#" class="sort__button">Sort by date</a></li>
  <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`
);

class SortFilms {
  constructor(){
    this._element = null;
  }

  getTemplate() {
    return createSortFilmsTemplate();
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

export default SortFilms;
