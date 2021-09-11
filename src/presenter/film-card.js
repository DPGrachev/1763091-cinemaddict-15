import { remove, replace, render, RenderPosition} from '../utils/render.js';
import { KeyCode, UpdateType, UserAction, State } from '../utils/const.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import { FilterType } from '../utils/const.js';

const bodyElement = document.querySelector('body');

class FilmCard{
  constructor(container, changeData, currentFilterType, api){
    this._currentFilterType = currentFilterType;
    this._filmCardContainer = container;
    this._changeData = changeData;
    this._film = null;
    this._filmCardId = null;
    this._filmCard = null;
    this._filmPopup = null;
    this._api = api;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handlePopapCloseButton = this._handlePopapCloseButton.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleSubmitNewComment = this._handleSubmitNewComment.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._resetFormState = this._resetFormState.bind(this);
  }

  init(card){
    const prevFilmCard = this._filmCard;
    const prevFilmPopup = this._filmPopup;
    this._film = card;
    this._filmCard = new FilmCardView(this._film);

    this._filmCard.setOnClick(() => {
      this._renderPopup();
    });
    this._filmCard.setOnWatchlistClick(this._handleAddToWatchlistClick);
    this._filmCard.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmCard.setOnWatchedClick(this._handleWatchedClick);

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
      case State.DELETING:
        this._filmPopup.updateData({
          isDisabledComment: true,
          isDeleting: true,
        });
        break;
    }
  }

  _handleAddToWatchlistClick(card){
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

  _handleFavoriteClick(card){
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

  _handleWatchedClick(card){
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

  _handleDeleteCommentClick(film){
    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.PATCH,
      film,
    );
  }

  _handleSubmitNewComment(card){
    this._changeData(
      UserAction.ADD_NEW_COMMENT,
      UpdateType.PATCH,
      card,
    );
  }

  _closePopup(){
    document.removeEventListener('keydown', this._handleEscKeyDown);
    bodyElement.removeChild(bodyElement.querySelector('.film-details'));
    bodyElement.classList.remove('hide-overflow');
  }

  _handleEscKeyDown(evt){
    if (evt.key === KeyCode.ESCAPE) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _handlePopapCloseButton () {
    this._closePopup();
  }

  _renderPopup(){
    if (bodyElement.querySelector('.film-details')){
      this._closePopup();
    }
    this._api.getComments(this._film)
      .then((comments) => {
        this._film.comments = comments;
        this._filmPopup = new FilmPopupView(this._film);
        this._setPopupHandlers();

        bodyElement.classList.add('hide-overflow');
        document.addEventListener('keydown',this._handleEscKeyDown);

        render(bodyElement, this._filmPopup, RenderPosition.BEFOREEND);
        this._filmPopup.reset(this._filmCard);
      })
      .catch(() => {
        throw new Error('Не удалось загрузить информацию, попробуйте позже');
      });

  }

  _setPopupHandlers(){
    this._filmPopup.setOnWatchlistClick(this._handleAddToWatchlistClick);
    this._filmPopup.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmPopup.setOnWatchedClick(this._handleWatchedClick);
    this._filmPopup.setOnCloseButtonClick(this._handlePopapCloseButton);
    this._filmPopup.setOnDeleteCommentClick(this._handleDeleteCommentClick);
    this._filmPopup.setSubmitNewComment(this._handleSubmitNewComment);
  }

  destroy(){
    if (bodyElement.querySelector('.film-details')){
      this._closePopup();
    }
    remove(this._filmCard);
  }
}

export default FilmCard;
