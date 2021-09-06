import SiteMenuView from '../view/site-menu';
import { filter } from '../utils/filter';
import { FilterType, UpdateType } from '../utils/const';
import { render, remove, replace, RenderPosition } from '../utils/render';
import HeaderProfileView from '../view/header-profile.js';

class SiteMenu {
  constructor(filtersContainer, headerContainer, filterModel, moviesModel){
    this._filtersContainer = filtersContainer;
    this._headerContainer = headerContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._siteMenuComponent = null;
    this._headerProfileComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._getWatchedFilmsCount = this._getWatchedFilmsCount.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init(){
    const filters = this._getFilters();
    const prevSiteMenuComponent = this._siteMenuComponent;
    const prevHeaderProfileComponent = this._headerProfileComponent;

    this._siteMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._siteMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._headerProfileComponent = new HeaderProfileView(this._getWatchedFilmsCount());

    if(prevSiteMenuComponent === null && prevHeaderProfileComponent === null){
      render(this._headerContainer, this._headerProfileComponent, RenderPosition.BEFOREEND);
      render(this._filtersContainer, this._siteMenuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._headerProfileComponent, prevHeaderProfileComponent);
    replace(this._siteMenuComponent, prevSiteMenuComponent);
    remove(prevHeaderProfileComponent);
    remove(prevSiteMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getWatchedFilmsCount(){
    let watchedFilmsCount = null;
    this._getFilters().forEach((item) => {
      if(item.type === FilterType.HISTORY){
        watchedFilmsCount = item.count;
      }
    });
    return watchedFilmsCount;
  }

  _getFilters(){
    const filmCards = this._moviesModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: 'All',
        count: filter[FilterType.ALL](filmCards).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filter[FilterType.WATCHLIST](filmCards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filter[FilterType.HISTORY](filmCards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filter[FilterType.FAVORITES](filmCards).length,
      },
    ];
  }
}

export default SiteMenu;
