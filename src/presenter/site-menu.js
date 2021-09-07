import SiteMenuView from '../view/site-menu';
import StatsView from '../view/stats';
import { filterTypeToCb } from '../utils/filter';
import { FilterType, UpdateType } from '../utils/const';
import { render, remove, replace, RenderPosition } from '../utils/render';
import HeaderProfileView from '../view/header-profile.js';

class SiteMenu {
  constructor(mainContainer, headerContainer, filterModel, moviesModel, contentBoard){
    this._mainContainer = mainContainer;
    this._headerContainer = headerContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;
    this._contentBoard = contentBoard;
    this._stats = null;

    this._siteMenuComponent = null;
    this._headerProfileComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._getWatchedFilmsCount = this._getWatchedFilmsCount.bind(this);
    this._handleStatsButtonClick = this._handleStatsButtonClick.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
    this._moviesModel.addObserver(this._handleModelEvent);
  }

  init(){
    const filters = this._getFilters();
    const prevSiteMenuComponent = this._siteMenuComponent;
    const prevHeaderProfileComponent = this._headerProfileComponent;

    this._siteMenuComponent = new SiteMenuView(filters, this._filterModel.getFilter());
    this._siteMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._siteMenuComponent.setOnStatsButtonClick(this._handleStatsButtonClick);
    this._headerProfileComponent = new HeaderProfileView(this._getWatchedFilmsCount());

    if(prevSiteMenuComponent === null && prevHeaderProfileComponent === null){
      render(this._headerContainer, this._headerProfileComponent, RenderPosition.BEFOREEND);
      render(this._mainContainer, this._siteMenuComponent, RenderPosition.BEFOREEND);
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

  _handleStatsButtonClick(){
    if(this._stats !== null){
      this._stats = null;
    }
    this._contentBoard.destroy();
    this._stats = new StatsView(this._moviesModel.getFilms());
    this._filterModel.setFilter(null);
    render(this._mainContainer, this._stats, RenderPosition.BEFOREEND);
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }
    if (this._mainContainer.querySelector('.statistic')){
      remove(this._stats);
    }

    this._filterModel.setFilter(filterType, UpdateType.MAJOR);
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
        count: filterTypeToCb[FilterType.ALL](filmCards).length,
      },
      {
        type: FilterType.WATCHLIST,
        name: 'Watchlist',
        count: filterTypeToCb[FilterType.WATCHLIST](filmCards).length,
      },
      {
        type: FilterType.HISTORY,
        name: 'History',
        count: filterTypeToCb[FilterType.HISTORY](filmCards).length,
      },
      {
        type: FilterType.FAVORITES,
        name: 'Favorites',
        count: filterTypeToCb[FilterType.FAVORITES](filmCards).length,
      },
    ];
  }
}

export default SiteMenu;
