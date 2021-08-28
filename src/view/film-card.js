import dayjs from 'dayjs';
import AbstractView from './abstract';

const checkUserDetailsForCard = (userDetails) => {
  if(userDetails){
    return 'film-card__controls-item--active';
  }
};
const createFilmCardTemplate = (card) => {
  const {comments,filmInfo: {title,poster,description,rating, release : {date, runtime}, genre: [firstGenre]},userDetails} = card;
  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${dayjs(date).year()}</span>
    <span class="film-card__duration">${runtime}m</span>
    <span class="film-card__genre">${firstGenre}</span>
  </p>
  <img src="${poster}"" class="film-card__poster">
  <p class="film-card__description">${description}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${checkUserDetailsForCard(userDetails.isWatchlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${checkUserDetailsForCard(userDetails.isAlreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${checkUserDetailsForCard(userDetails.isFavorite)}" type="button">Mark as favorite</button>
  </div>
  </article>`;
};

class FilmCard extends AbstractView{
  constructor(card){
    super();
    this._card = card;
    this._onClick = this._onClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  _onClick(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _onWatchlistClick(evt) {
    evt.preventDefault();
    this._callback.onWatchlistClick((this._card));
  }

  _onWatchedClick(evt) {
    evt.preventDefault();
    this._callback.onWatchedClick(this._card);
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    this._callback.onFavoriteClick(this._card);
  }

  setOnClick(callback) {
    this._callback.click = callback;
    this.getElement().querySelector('.film-card__poster').addEventListener('click', this._onClick);
    this.getElement().querySelector('.film-card__title').addEventListener('click', this._onClick);
    this.getElement().querySelector('.film-card__comments').addEventListener('click', this._onClick);
  }

  setOnWatchlistClick(callback) {
    this._callback.onWatchlistClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._onWatchlistClick);
  }

  setOnWatchedClick(callback) {
    this._callback.onWatchedClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._onWatchedClick);
  }

  setOnFavoriteClick(callback) {
    this._callback.onFavoriteClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._onFavoriteClick);
  }

  getCard(){
    return this._card;
  }
}

export default FilmCard;
