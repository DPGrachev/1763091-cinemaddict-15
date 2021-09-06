import { render, remove, RenderPosition} from '../utils/render.js';
import { sortDateDown, sortRatingDown } from '../utils/card.js';
import { SortType, UserAction, UpdateType, FilterType } from '../utils/const.js';
import { filterTypeToCb } from '../utils/filter.js';
import SortFilmsView from '../view/sort-films.js';
import ContentAreaView from '../view/content-area.js';
import EmptyFilmsListView from '../view/empty-films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCardPresenter from './film-card.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

class ContentBoard {
  constructor(contentContainer, filmsModel, filterModel){
    this._contentContainer = contentContainer;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._contentArea = new ContentAreaView();
    this._sortFilms = null;
    this._showMoreButton = null;
    this._emptyFilmList = null;
    this._mainFilmsList = this._contentArea.getElement().querySelector('.main-films-list');
    this._topRatedFilmsList = this._contentArea.getElement().querySelector('.top-rated-films-list');
    this._mostCommentedFilmsList = this._contentArea.getElement().querySelector('.most-commented-films-list');
    this._filmCardMainPresenter = new Map();
    this._filmCardTopRatedPresenter = new Map();
    this._filmCardMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init(){
    this._renderContenArea();
  }

  _getFilms(){
    this._filterType = this._filterModel.getFilter();
    const filmCards = this._filmsModel.getFilms();
    const filtredFilmCards = filterTypeToCb[this._filterType](filmCards);

    switch (this._currentSortType){
      case SortType.DATE_DOWN: {
        return filtredFilmCards.sort(sortDateDown);
      }
      case SortType.RATING_DOWN: {
        return filtredFilmCards.sort(sortRatingDown);
      }
    }
    return filtredFilmCards;
  }

  _renderSortFilms(){
    if(this._sortFilms !== null){
      this._sortFilms = null;
    }

    this._sortFilms = new SortFilmsView(this._currentSortType);
    render(this._contentContainer, this._sortFilms, RenderPosition.BEFOREEND);
    this._sortFilms.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(card,filmCardContainer){
    const filmCard = new FilmCardPresenter(filmCardContainer, this._handleViewAction, this._filterModel.getFilter());
    filmCard.init(card);

    switch (filmCardContainer) {
      case this._mainFilmsList:{
        this._filmCardMainPresenter.set(card.id, filmCard);
        break;
      }
      case this._topRatedFilmsList:{
        this._filmCardTopRatedPresenter.set(card.id, filmCard);
        break;
      }
      case this._mostCommentedFilmsList:{
        this._filmCardMostCommentedPresenter.set(card.id, filmCard);
        break;
      }
    }
  }

  _clearFilmsList({resetRenderedFilmCardsCount = false, resetSortType = false} = {}){
    const filmCardCount = this._getFilms().length;

    this._filmCardMainPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardMainPresenter.clear();
    this._filmCardTopRatedPresenter.clear();
    this._filmCardMostCommentedPresenter.clear();
    remove(this._sortFilms);
    remove(this._showMoreButton);

    if(this._emptyFilmList){
      remove(this._emptyFilmList);
    }

    this._renderedFilmCardsCount = resetRenderedFilmCardsCount? FILMS_COUNT_PER_STEP : Math.min(filmCardCount, this._renderedFilmCardsCount);

    if(resetSortType){
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmCards(filmCards, container){
    filmCards.forEach((card) => this._renderFilmCard(card, container));
  }

  _handleShowMoreButtonClick(){
    const filmCardsCount = this._getFilms().length;
    const newRenderedFilmCardsCount= Math.min(filmCardsCount, this._renderedFilmCardsCount + FILMS_COUNT_PER_STEP);
    const filmCards = this._getFilms().slice(this._renderedFilmCardsCount,newRenderedFilmCardsCount);
    this._renderFilmCards(filmCards, this._mainFilmsList);
    this._renderedFilmCardsCount = newRenderedFilmCardsCount;
    if(this._renderedFilmCardsCount >= filmCardsCount){
      remove(this._showMoreButton);
    }
  }

  _handleSortTypeChange(sortType){
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsList({resetRenderedFilmCardsCount: true});
    this._renderContenArea();
  }

  _renderShowMoreButton(){
    this._showMoreButton = new ShowMoreButtonView();
    const filmsList = document.querySelector('.films-list');
    render(filmsList,this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedFilms(){
    const movieSortByRating = this._getFilms().slice().sort(sortRatingDown);

    for (let i=0; i< Math.min(EXTRA_FILMS_COUNT, this._getFilms().length); i++){
      this._renderFilmCard(movieSortByRating[i], this._topRatedFilmsList);
    }
  }

  _renderMostCommentedFilms(){
    const movieSortByComments = this._getFilms().slice().sort((a,b)=> b.comments.length - a.comments.length);
    for (let i=0; i< Math.min(EXTRA_FILMS_COUNT,this._getFilms().length); i++){
      this._renderFilmCard(movieSortByComments[i], this._mostCommentedFilmsList);
    }
  }

  _renderEmptyFilmList(){
    this._emptyFilmList = new EmptyFilmsListView(this._filterType);
    render(this._mainFilmsList, this._emptyFilmList, RenderPosition.BEFOREEND);
  }

  _renderContenArea(){
    const filmCards = this._getFilms();
    const filmCardsCount = filmCards.length;

    if(filmCardsCount === 0){
      this._renderEmptyFilmList();
      return;
    }

    this._renderSortFilms();
    render(this._contentContainer,this._contentArea, RenderPosition.BEFOREEND);
    this._renderFilmCards(filmCards.slice(0,Math.min(this._renderedFilmCardsCount, filmCardsCount)), this._mainFilmsList);

    if(filmCardsCount > this._renderedFilmCardsCount){
      this._renderShowMoreButton();
    }

    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _handleViewAction(actionType, updateType, update) {
    if(actionType === UserAction.UPDATE_FILM_CARD){
      this._filmsModel.updateFilm(updateType, update);
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType){
      case UpdateType.PATCH: {
        if(this._filmCardMainPresenter.get(data.id)){
          this._filmCardMainPresenter.get(data.id).init(data);
        }
        if(this._filmCardTopRatedPresenter.get(data.id)){
          this._filmCardTopRatedPresenter.get(data.id).init(data);
        }
        if(this._filmCardMostCommentedPresenter.get(data.id)){
          this._filmCardMostCommentedPresenter.get(data.id).init(data);
        }
        break;
      }
      case UpdateType.MINOR: {
        this._clearFilmsList();
        this._renderContenArea();
        break;
      }
      case UpdateType.MAJOR: {
        this._clearFilmsList({resetRenderedFilmCardsCount: true, resetSortType: true});
        this._renderContenArea();
        break;
      }
    }
  }
}

export default ContentBoard;
