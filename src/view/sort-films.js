import AbstractView from './abstract';
import { SortType } from '../utils/const';

const createSortFilmsTemplate = (sortType) => (
  `<ul class="sort">
  <li><a href="#" class="sort__button ${sortType === SortType.DEFAULT? 'sort__button--active': ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
  <li><a href="#" class="sort__button ${sortType === SortType.DATE_DOWN? 'sort__button--active': ''}"  data-sort-type="${SortType.DATE_DOWN}">Sort by date</a></li>
  <li><a href="#" class="sort__button ${sortType === SortType.RATING_DOWN? 'sort__button--active': ''}" data-sort-type="${SortType.RATING_DOWN}">Sort by rating</a></li>
  </ul>`
);

class SortFilmsComponent extends AbstractView {
  constructor(sortType){
    super();

    this._currentSortType = sortType;
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
  }

  getTemplate() {
    return createSortFilmsTemplate(this._currentSortType);
  }

  _onSortTypeChange(evt){
    if(!evt.target.dataset.sortType){
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
    this.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
  }

  setOnSortTypeChange(callback){
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._onSortTypeChange);
  }

}

export default SortFilmsComponent;
