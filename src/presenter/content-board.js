import { render, remove, RenderPosition} from '../utils/render.js';
import { sortDateDown, sortRatingDown } from '../utils/card.js';
import { SortType, UserAction, UpdateType, FilterType, State } from '../utils/const.js';
import { filterTypeToCb } from '../utils/filter.js';
import SortFilmsView from '../view/sort-films-component.js';
import LoadingComponentView from '../view/loading-component.js';
import ContentAreaView from '../view/content-area.js';
import EmptyFilmsListView from '../view/empty-films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsView from '../view/top-rated-films-component.js';
import MostCommentedFilmsView from '../view/most-commented-films-component.js';
import FilmCardPresenter from './film-card.js';
import { isOnline } from '../utils/common.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

class ContentBoard {
  constructor(contentContainer, filmsModel, filterModel,api){
    this._contentContainer = contentContainer;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._filmsWithComments = null;
    this._sortFilms = null;
    this._showMoreButton = null;
    this._emptyFilmList = null;
    this._contentArea = null;
    this._isLoading = true;
    this._loadingComponent = new LoadingComponentView();
    this._mostCommentedFilmsComponent = null;
    this._api = api;

    this._filmCardMainPresenter = new Map();
    this._filmCardTopRatedPresenter = new Map();
    this._filmCardMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;

    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onViewAction = this._onViewAction.bind(this);
    this._onModelEvent = this._onModelEvent.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this.destroy = this.destroy.bind(this);
    this._closeOpenedPopup = this._closeOpenedPopup.bind(this);

    this._filmsModel.addObserver(this._onModelEvent);
    this._filterModel.addObserver(this._onModelEvent);
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
        return filtredFilmCards.slice().sort(sortDateDown);
      }
      case SortType.RATING_DOWN: {
        return filtredFilmCards.slice().sort(sortRatingDown);
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
    this._sortFilms.setOnSortTypeChange(this._onSortTypeChange);
  }

  _renderFilmCard(card,filmCardContainer){
    const filmCard = new FilmCardPresenter(filmCardContainer, this._onViewAction, this._filterModel.getFilter(), this._api, this._closeOpenedPopup);
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
    this._mostCommentedFilmsComponent = null;
    remove(this._sortFilms);
    remove(this._loadingComponent);
    remove(this._contentArea);

    if(this._emptyFilmList){
      remove(this._emptyFilmList);
    }

    this._renderedFilmCardsCount = resetRenderedFilmCardsCount? FILMS_COUNT_PER_STEP : Math.min(filmCardCount, this._renderedFilmCardsCount);

    if(resetSortType){
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _closeOpenedPopup(){
    this._filmCardMainPresenter.forEach((presenter) => presenter.destroyPopup());
    this._filmCardTopRatedPresenter.forEach((presenter) => presenter.destroyPopup());
    this._filmCardMostCommentedPresenter.forEach((presenter) => presenter.destroyPopup());
  }

  _renderFilmCards(filmCards, container){
    filmCards.forEach((card) => this._renderFilmCard(card, container));
  }

  _onShowMoreButtonClick(){
    const filmCardsCount = this._getFilms().length;
    const newRenderedFilmCardsCount= Math.min(filmCardsCount, this._renderedFilmCardsCount + FILMS_COUNT_PER_STEP);
    const filmCards = this._getFilms().slice(this._renderedFilmCardsCount,newRenderedFilmCardsCount);
    this._renderFilmCards(filmCards, this._mainFilmsList);
    this._renderedFilmCardsCount = newRenderedFilmCardsCount;
    if(this._renderedFilmCardsCount >= filmCardsCount){
      remove(this._showMoreButton);
    }
  }

  _onSortTypeChange(sortType){
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

    this._showMoreButton.setOnClick(this._onShowMoreButtonClick);
  }

  _renderTopRatedFilms(){
    const filmsWithRating = this._getFilms().slice().filter((filmCard) => filmCard.filmInfo.rating > 0);
    if(filmsWithRating.length !== 0){
      render(this._contentArea, new TopRatedFilmsView(), RenderPosition.BEFOREEND);
      this._topRatedFilmsList = document.querySelector('.top-rated-films-list');
      const movieSortByRating = this._getFilms().slice().sort(sortRatingDown);

      for (let i=0; i< Math.min(EXTRA_FILMS_COUNT, filmsWithRating.length); i++){
        this._renderFilmCard(movieSortByRating[i], this._topRatedFilmsList);
      }
    }
  }

  _renderMostCommentedFilms(){
    this._filmsWithComments = this._getFilms().slice().filter((film) => film.comments.length > 0);
    if(this._filmsWithComments.length > 0){
      if(!this._mostCommentedFilmsComponent){
        this._mostCommentedFilmsComponent = new MostCommentedFilmsView();
        render(this._contentArea, this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
        this._mostCommentedFilmsList = document.querySelector('.most-commented-films-list');
      }
      const movieSortByComments = this._filmsWithComments.sort((a,b)=> b.comments.length - a.comments.length);
      for (let i=0; i< Math.min(EXTRA_FILMS_COUNT,movieSortByComments.length); i++){
        this._renderFilmCard(movieSortByComments[i], this._mostCommentedFilmsList);
      }
    }
  }

  _clearMostCommentedFilms(){
    this._filmCardMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardMostCommentedPresenter.clear();
  }

  _updateMostCommentedFilms(userAction, film){
    switch (userAction){
      case UserAction.ADD_NEW_COMMENT:{
        if(this._filmsWithComments.length > 0){
          this._clearMostCommentedFilms();
          this._renderMostCommentedFilms();
        }else{
          this._renderMostCommentedFilms();
        }
        break;
      }
      case UserAction.DELETE_COMMENT:{
        if(this._filmsWithComments.length > 1 || film.comments.length > 0){
          this._clearMostCommentedFilms();
          this._renderMostCommentedFilms();
        }else{
          this._clearMostCommentedFilms();
          this._contentArea.getElement().removeChild(this._mostCommentedFilmsComponent.getElement());
          this._mostCommentedFilmsComponent = null;
        }
        break;
      }
    }
  }

  _renderLoading(){
    render(this._contentContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderEmptyFilmList(){
    this._emptyFilmList = new EmptyFilmsListView(this._filterType);
    render(this._contentContainer, this._emptyFilmList, RenderPosition.BEFOREEND);
  }

  _renderContenArea(){
    if(this._isLoading){
      this._renderLoading();
      return;
    }

    const filmCards = this._getFilms();
    const filmCardsCount = filmCards.length;

    if(filmCardsCount === 0){
      this._renderEmptyFilmList();
      return;
    }

    this._contentArea = new ContentAreaView();
    this._mainFilmsList = this._contentArea.getElement().querySelector('.main-films-list');

    this._renderSortFilms();
    render(this._contentContainer,this._contentArea, RenderPosition.BEFOREEND);

    this._renderFilmCards(filmCards.slice(0,Math.min(this._renderedFilmCardsCount, filmCardsCount)), this._mainFilmsList);

    if(filmCardsCount > this._renderedFilmCardsCount){
      this._renderShowMoreButton();
    }
    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  destroy(){
    this._clearFilmsList({resetRenderedFilmCardsCount: true, resetSortType: true});
  }

  _onViewAction(actionType, updateType, update) {
    switch (actionType){
      case UserAction.UPDATE_FILM_CARD:{
        this._api.updateMovie(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      }
      case UserAction.ADD_NEW_COMMENT:{
        if(!isOnline()){
          return this._filmCardMainPresenter.get(update.id).setAbortingSendNewComment();
        }
        this._setViewStateInOpenPopup(update.id, State.SENDING_NEW_COMMENT);
        this._api.addNewComment(update)
          .then((response)=> {
            this._filmsModel.updateFilm(updateType, response);
            this._updateMostCommentedFilms(UserAction.ADD_NEW_COMMENT);
          })
          .catch(() => {
            this._filmCardMainPresenter.get(update.id).setAbortingSendNewComment();
          });
        break;
      }
      case UserAction.DELETE_COMMENT:{
        this._setViewStateInOpenPopup(update.id, State.DELETING);
        this._api.deleteComment(update)
          .then(() => {
            this._filmsModel.updateFilm(updateType, update);
            this._updateMostCommentedFilms(UserAction.DELETE_COMMENT, update);
          })
          .catch(() => {
            this._filmCardMainPresenter.get(update.id).setAbortingDeletingComment();
          });
      }
    }
  }

  _setViewStateInOpenPopup(filmId,state){
    if(this._filmCardMainPresenter.get(filmId) && this._filmCardMainPresenter.get(filmId).getPopup()){
      this._filmCardMainPresenter.get(filmId).setViewState(state);
    }
    if(this._filmCardTopRatedPresenter.get(filmId) && this._filmCardTopRatedPresenter.get(filmId).getPopup()){
      this._filmCardTopRatedPresenter.get(filmId).setViewState(state);
    }
    if(this._filmCardMostCommentedPresenter.get(filmId) && this._filmCardMostCommentedPresenter.get(filmId).getPopup()){
      this._filmCardMostCommentedPresenter.get(filmId).setViewState(state);
    }
  }

  _onModelEvent(updateType, data) {

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
      case UpdateType.INIT: {
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderContenArea();
        break;
      }
    }
  }
}

export default ContentBoard;
