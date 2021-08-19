import dayjs from 'dayjs';
import { createElement } from '../utils';

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
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${checkUserDetailsForCard(userDetails.isWachlist)}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${checkUserDetailsForCard(userDetails.isAlreadyWatched)}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${checkUserDetailsForCard(userDetails.isFavorite)}" type="button">Mark as favorite</button>
  </div>
  </article>`;
};

class FilmCard {
  constructor(card){
    this._card = card;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default FilmCard;
