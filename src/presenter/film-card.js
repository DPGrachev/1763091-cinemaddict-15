import { remove, replace, render, RenderPosition} from '../utils/render.js';
import { KeyCode, UpdateType, UserAction } from '../utils/const.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';
import { FilterType } from '../utils/const.js';

const bodyElement = document.querySelector('body');

class FilmCard{
  constructor(container, changeData, currentFilterType){
    this._currentFilterType = currentFilterType;
    this._filmCardContainer = container;
    this._changeData = changeData;
    this._filmCard = null;
    this._filmPopup = null;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handlePopapCloseButton = this._handlePopapCloseButton.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleSubmitNewComment = this._handleSubmitNewComment.bind(this);
    this._closePopup = this._closePopup.bind(this);
  }

  init(card){
    const prevFilmCard = this._filmCard;
    const prevFilmPopup = this._filmPopup;

    this._filmCard = new FilmCardView(card);
    this._filmPopup = new FilmPopupView(card);

    this._filmCard.setOnClick(() => {
      this._renderPopup(this._filmPopup);
    });
    this._filmCard.setOnWatchlistClick(this._handleAddToWatchlistClick);
    this._filmCard.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmCard.setOnWatchedClick(this._handleWatchedClick);
    this._filmPopup.setOnWatchlistClick(this._handleAddToWatchlistClick);
    this._filmPopup.setOnFavoriteClick(this._handleFavoriteClick);
    this._filmPopup.setOnWatchedClick(this._handleWatchedClick);
    this._filmPopup.setOnCloseButtonClick(this._handlePopapCloseButton);
    this._filmPopup.setOnDeleteCommentClick(this._handleDeleteCommentClick);
    this._filmPopup.setSubmitNewComment(this._handleSubmitNewComment);

    if(prevFilmCard === null || prevFilmPopup === null){
      render(this._filmCardContainer, this._filmCard, RenderPosition.BEFOREEND);
      return;
    }
    if(this._filmCardContainer.contains(prevFilmCard.getElement())){
      replace(this._filmCard, prevFilmCard);
    }
    if(bodyElement.contains(prevFilmPopup.getElement())){
      replace(this._filmPopup, prevFilmPopup);
    }

    remove(prevFilmCard);
    remove(prevFilmPopup);
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
            },
          ),
        },
      ),
    );
  }

  _handleDeleteCommentClick(card){
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
      UpdateType.PATCH,
      card,
    );
  }

  _handleSubmitNewComment(card){
    this._changeData(
      UserAction.UPDATE_FILM_CARD,
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

  _renderPopup(popup){
    if (bodyElement.querySelector('.film-details')){
      this._closePopup();
    }
    bodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown',this._handleEscKeyDown);
    bodyElement.appendChild(popup.getElement());
    this._filmPopup.reset(this._filmCard);
  }

  destroy(){
    if (bodyElement.querySelector('.film-details')){
      this._closePopup();
    }
    remove(this._filmCard);
  }
}

export default FilmCard;
