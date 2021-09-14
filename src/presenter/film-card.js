import { remove, replace, render, RenderPosition} from '../utils/render.js';
import { KeyCode, UpdateType, UserAction, State } from '../utils/const.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import { FilterType } from '../utils/const.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

const SHOW_TIME = 5000;
const bodyElement = document.querySelector('body');

class FilmCard{
  constructor(container, changeData, currentFilterType, api, closeOpenedPopup){
    this._currentFilterType = currentFilterType;
    this._filmCardContainer = container;
    this._changeData = changeData;
    this._closeOpenedPopup = closeOpenedPopup;
    this._film = null;
    this._filmCardId = null;
    this._filmCard = null;
    this._filmPopup = null;
    this._api = api;

    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onAddToWatchlistClick = this._onAddToWatchlistClick.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onPopapCloseButton = this._onPopapCloseButton.bind(this);
    this._onDeleteCommentClick = this._onDeleteCommentClick.bind(this);
    this._onNewCommentSubmit = this._onNewCommentSubmit.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._resetFormState = this._resetFormState.bind(this);
  }

  getPopup(){
    return this._filmPopup;
  }

  init(card){
    const prevFilmCard = this._filmCard;
    const prevFilmPopup = this._filmPopup;
    this._film = card;
    this._filmCard = new FilmCardView(this._film);

    this._filmCard.setOnClick(() => {
      this._renderPopup();
    });
    this._filmCard.setOnWatchlistClick(this._onAddToWatchlistClick);
    this._filmCard.setOnFavoriteClick(this._onFavoriteClick);
    this._filmCard.setOnWatchedClick(this._onWatchedClick);

    if(prevFilmCard === null){
      render(this._filmCardContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }
    if(this._filmCardContainer.contains(prevFilmCard.getElement())){
      replace(this._filmCard, prevFilmCard);
    }
    if(prevFilmPopup && bodyElement.contains(prevFilmPopup.getElement())){
      this._renderPopup();
    }

    remove(prevFilmCard);
    remove(prevFilmPopup);
  }

  _resetFormState(){
    this._filmPopup.updateData({
      isDisabledForm: false,
      isDisabledComment: false,
      isDeleting: false,
    });
  }

  setAbortingSendNewComment(){
    this._filmPopup.shake(this._filmPopup.getElementOfNewComment() ,this._resetFormState);
  }

  setAbortingDeletingComment(){
    this._filmPopup.shake(this._filmPopup.getElementOfDeletingComment() ,this._resetFormState);
  }

  setViewState(state) {
    switch (state) {
      case State.SENDING_NEW_COMMENT:{
        this._filmPopup.updateData({
          isDisabledForm: true,
        });
        break;
      }
      case State.DELETING:{
        this._filmPopup.updateData({
          isDisabledComment: true,
          isDeleting: true,
        });
        break;
      }
    }
  }

  _onAddToWatchlistClick(card){
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      this._currentFilterType === FilterType.WATCHLIST? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        card,
        {
          userDetails: Object.assign(
            {},
            card.userDetails,
            {
              isWatchlist: !card.userDetails.isWatchlist,
            },
          ),
        },
      ),
    );
  }

  _onFavoriteClick(card){
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      this._currentFilterType === FilterType.FAVORITES? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        card,
        {
          userDetails: Object.assign(
            {},
            card.userDetails,
            {
              isFavorite: !card.userDetails.isFavorite,
            },
          ),
        },
      ),
    );
  }

  _onWatchedClick(card){
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      this._currentFilterType === FilterType.HISTORY? UpdateType.MINOR : UpdateType.PATCH,
      Object.assign(
        {},
        card,
        {
          userDetails: Object.assign(
            {},
            card.userDetails,
            {
              isAlreadyWatched: !card.userDetails.isAlreadyWatched,
              watchingDate: card.userDetails.watchingDate === null ? card.filmInfo.release.date : null,
            },
          ),
        },
      ),
    );
  }

  _onDeleteCommentClick(film){
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      film,
    );
  }

  _onNewCommentSubmit(card){
    this._changeData(
      UserAction.ADD_NEW_COMMENT,
      UpdateType.PATCH,
      card,
    );
  }

  _onEscKeyDown(evt){
    if (evt.key === KeyCode.ESCAPE) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _closePopup(){
    document.removeEventListener('keydown', this._onEscKeyDown);
    this._filmPopup = null;
    bodyElement.querySelector('.film-details').remove();
    bodyElement.classList.remove('hide-overflow');
  }

  destroyPopup(){
    if(this._filmPopup === null){
      return;
    }
    this._closePopup();
  }

  _onPopapCloseButton () {
    this._closePopup();
  }

  _renderPopup(){
    this._closeOpenedPopup();
    if(isOnline()){
      return this._api.getComments(this._film)
        .then((comments) => {
          this._createPopup(comments);
        })
        .catch(() => {
          throw new Error('Не удалось загрузить информацию, попробуйте позже');
        });
    }
    toast('Добавление и удаление комментариев в режиме офлайн недоступно.', SHOW_TIME);
    return this._createPopup(this._film.comments);

  }

  _createPopup(comments){
    this._film.comments = comments;
    this._filmPopup = new FilmPopupView(this._film);
    this._setPopupHandlers();

    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown',this._onEscKeyDown);

    render(bodyElement, this._filmPopup, RenderPosition.BEFOREEND);
    this._filmPopup.reset(this._filmCard);
  }

  _setPopupHandlers(){
    this._filmPopup.setOnWatchlistClick(this._onAddToWatchlistClick);
    this._filmPopup.setOnFavoriteClick(this._onFavoriteClick);
    this._filmPopup.setOnWatchedClick(this._onWatchedClick);
    this._filmPopup.setOnCloseButtonClick(this._onPopapCloseButton);
    this._filmPopup.setOnDeleteCommentClick(this._onDeleteCommentClick);
    this._filmPopup.setOnNewCommentSubmit(this._onNewCommentSubmit);
  }

  destroy(){
    if (bodyElement.querySelector('.film-details')){
      this._closePopup();
    }
    remove(this._filmCard);
  }
}

export default FilmCard;
