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
  <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`
);

class SiteMenu extends AbstractView {
  constructor(filter, currentFilterType){
    super();
    this._filter = filter;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filter, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.name);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelectorAll('.main-navigation__item ')
      .forEach((filterButton) => filterButton.addEventListener('click', this._filterTypeChangeHandler));
  }
}

export default SiteMenu;
