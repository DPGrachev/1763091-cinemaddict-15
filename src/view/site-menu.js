import AbstractView from './abstract';

const createFilters = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return `<a href="#${name}" class="main-navigation__item ${currentFilterType === type? 'main-navigation__item--active': ''}" data-name="${name}">${type === 'All'? 'All movies </a>' : `${name} <span class="main-navigation__item-count">${count}</span></a>`}`;
};

const createSiteMenuTemplate = (filters, currentFilterType) => (
  `<nav class="main-navigation">
  <div class="main-navigation__items">
    ${filters.map((filter) => createFilters(filter, currentFilterType)).join(' ')}
  </div>
  <a href="#stats" class="main-navigation__additional ${currentFilterType === 'null'? 'main-navigation__additional--active': ''}">Stats</a>
  </nav>`
);

class SiteMenu extends AbstractView {
  constructor(filter, currentFilterType){
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;
    this._filterButtons = this.getElement().querySelectorAll('.main-navigation__item ');
    this._statsButton = this.getElement().querySelector('.main-navigation__additional');

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._onStatsButtonClick = this._onStatsButtonClick.bind(this);
  }

  getTemplate() {

    return createSiteMenuTemplate(this._filter, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if(evt.target.tagName !== 'SPAN'){
      evt.preventDefault();
      this._callback.filterTypeChange(evt.target.dataset.name);
    }
  }

  _onStatsButtonClick(evt){
    if(!evt.target.classList.contains('main-navigation__additional--active')){
      evt.preventDefault();
      this._filterButtons.forEach((filterButton) => filterButton.classList.remove('main-navigation__item--active'));
      this._statsButton.classList.add('main-navigation__additional--active');
      this._callback.onStatsButtonClick();
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this._filterButtons.forEach((filterButton) => filterButton.addEventListener('click', this._filterTypeChangeHandler));
  }

  setOnStatsButtonClick(callback){
    this._callback.onStatsButtonClick = callback;
    this.getElement().querySelector('.main-navigation__additional').addEventListener('click', this._onStatsButtonClick);
  }
}

export default SiteMenu;
