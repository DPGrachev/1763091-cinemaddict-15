import { render, remove, RenderPosition} from '../utils/render.js';
import { sortDateDown, sortRatingDown } from '../utils/card.js';
import { updateItem } from '../utils/common.js';
import { SortType } from '../utils/const.js';
import SortFilmsView from '../view/sort-films.js';
import ContentAreaView from '../view/content-area.js';
import EmptyFilmsListView from '../view/empty-films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCardPresenter from './film-card.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;

class ContentBoard {
  constructor(contentContainer){
    this._contentContainer = contentContainer;
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    this._contentArea = new ContentAreaView();
    this._sortFilms = new SortFilmsView();
    this._showMoreButton = new ShowMoreButtonView();
    this._mainFilmsList = this._contentArea.getElement().querySelector('.main-films-list');
    this._topRatedFilmsList = this._contentArea.getElement().querySelector('.top-rated-films-list');
    this._mostCommentedFilmsList = this._contentArea.getElement().querySelector('.most-commented-films-list');
    this._EmptyFilmList = new EmptyFilmsListView();
    this._filmCardMainPresenter = new Map();
    this._filmCardTopRatedPresenter = new Map();
    this._filmCardMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(filmCards){
    this._filmCards = filmCards.slice();
    this._sourcedFilmCards = filmCards.slice();
    this._renderContenArea();
  }

  _renderSortFilms(){
    render(this._contentContainer, this._sortFilms, RenderPosition.BEFOREEND);
    this._sortFilms.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmCard(card,filmCardContainer){
    const filmCard = new FilmCardPresenter(filmCardContainer, this._handleFilmCardChange);
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

  _clearFilmsList(){
    this._filmCardMainPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._filmCardMainPresenter.clear();
    this._filmCardTopRatedPresenter.clear();
    this._filmCardMostCommentedPresenter.clear();
    this._renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    remove(this._showMoreButton);
  }

  _renderFilmCards(from, to, container){
    this._filmCards
      .slice(from,to)
      .forEach((card) => this._renderFilmCard(card, container));
  }

  _handleShowMoreButtonClick(){
    this._renderFilmCards(this._renderedFilmCardsCount, this._renderedFilmCardsCount + FILMS_COUNT_PER_STEP, this._mainFilmsList);
    this._renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
    if(this._renderedFilmCardsCount >= this._filmCards.length){
      remove(this._showMoreButton);
    }
  }

  _handleSortTypeChange(sortType){
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilmCards(sortType);
    this._clearFilmsList();
    this._renderContenArea();
  }

  _sortFilmCards(sortType) {
    switch (sortType) {
      case SortType.RATING_DOWN:{
        this._filmCards.sort(sortRatingDown);
        break;
      }
      case SortType.DATE_DOWN:{
        this._filmCards.sort(sortDateDown);
        break;
      }
      default:{
        this._filmCards = this._sourcedFilmCards.slice();
      }
    }

    this._currentSortType = sortType;
  }

  _renderShowMoreButton(){
    const filmsList = document.querySelector('.films-list');
    render(filmsList,this._showMoreButton, RenderPosition.BEFOREEND);

    this._showMoreButton.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderTopRatedFilms(){
    const movieSortByRating = this._filmCards.slice().sort(sortRatingDown);

    for (let i=0; i< Math.min(EXTRA_FILMS_COUNT, this._filmCards.length); i++){
      this._renderFilmCard(movieSortByRating[i], this._topRatedFilmsList);
    }
  }

  _renderMostCommentedFilms(){
    const movieSortByComments = this._filmCards.slice().sort((a,b)=> b.comments.length - a.comments.length);
    for (let i=0; i< Math.min(EXTRA_FILMS_COUNT,this._filmCards.length); i++){
      this._renderFilmCard(movieSortByComments[i], this._mostCommentedFilmsList);
    }
  }

  _renderEmptyFilmList(){
    render(this._contentContainer, this._EmptyFilmList, RenderPosition.BEFOREEND);
  }

  _renderContenArea(){
    if(this._filmCards.length === 0){
      this._renderEmptyFilmList();
      return;
    }
    this._renderSortFilms();

    render(this._contentContainer,this._contentArea, RenderPosition.BEFOREEND);
    this._renderFilmCards(0,Math.min(FILMS_COUNT_PER_STEP, this._filmCards.length),this._mainFilmsList);

    if(this._filmCards.length > FILMS_COUNT_PER_STEP){
      this._renderShowMoreButton();
    }

    this._renderTopRatedFilms();
    this._renderMostCommentedFilms();
  }

  _handleFilmCardChange(updatedFilmCard){
    this._filmCards = updateItem(this._filmCards, updatedFilmCard);
    this._sourcedFilmCards = updateItem(this._sourcedFilmCards, updatedFilmCard);
    if(this._filmCardMainPresenter.get(updatedFilmCard.id)){
      this._filmCardMainPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
    }
    if(this._filmCardTopRatedPresenter.get(updatedFilmCard.id)){
      this._filmCardTopRatedPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
    }
    if(this._filmCardMostCommentedPresenter.get(updatedFilmCard.id)){
      this._filmCardMostCommentedPresenter.get(updatedFilmCard.id).init(updatedFilmCard);
    }
  }
}

export default ContentBoard;
