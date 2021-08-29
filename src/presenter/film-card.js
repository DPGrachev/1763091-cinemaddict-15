import { remove, replace, render, RenderPosition} from '../utils/render.js';
import { KeyCode } from '../utils/const.js';
import FilmCardView from '../view/film-card.js';
import FilmPopupView from '../view/film-popup.js';

const bodyElement = document.querySelector('body');

class FilmCard{
  constructor(container, changeData){
    this._filmCardContainer = container;
    this._changeData = changeData;
    this._filmCard = null;
    this._filmPopup = null;

    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handlePopapCloseButton = this._handlePopapCloseButton.bind(this);
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
    bodyElement.appendChild(popup.getElement());

    document.addEventListener('keydown',this._handleEscKeyDown);
    bodyElement.appendChild(popup.getElement());
  }

  destroy(){
    remove(this._filmCard);
    remove(this._filmPopup);
  }
}

export default FilmCard;
