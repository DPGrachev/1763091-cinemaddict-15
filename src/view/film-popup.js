import dayjs from 'dayjs';
import he from 'he';
import SmartView from './smart';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { KeyCode } from '../utils/const';
import { calculateRuntime, isOnline } from '../utils/common';
import { createElement, replace } from '../utils/render.js';
dayjs.extend(RelativeTime);

const getAllGenres = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span> `).join(' ');

const getAllHumans = (humans) => humans.map((human) => human).join(', ');
const checkUserDetailsForPopup = (userDetails) => {
  if(userDetails){
    return 'film-details__control-button--active';
  }
};

const createComment = (comment, isDisabledComment, isDeleting) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs().to(dayjs(comment.date))}</span>
        <button class="film-details__comment-delete" data-id="${comment.id}" ${isDisabledComment ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete' }</button>
      </p>
    </div>
    </li>`;

const renderComments = (data) => {
  const {comments, commentToDelete, isDisabledComment, isDeleting} = data;
  const allComments = comments.map((comment) => {
    if(comment === commentToDelete){
      return createComment(comment, isDisabledComment, isDeleting);
    }
    return createComment(comment);
  }).join(' ');

  return `<ul class="film-details__comments-list">
    ${allComments}
  </ul>`;
};

const createFormNewComment = (data) => `<div class="film-details__new-comment">
<div class="film-details__add-emoji-label">
 ${data.newComment.emotion ? `<img src="./images/emoji/${data.newComment.emotion}.png" width="55" height="55" alt="emoji">` : ''}
</div>

<label class="film-details__comment-label">
  <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${data.isDisabledForm ? 'disabled' : ''}>${data.newComment.commentText ? data.newComment.commentText : ''}</textarea>
</label>

<div class="film-details__emoji-list">
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
  <label class="film-details__emoji-label" for="emoji-smile">
    <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
  </label>

  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
  <label class="film-details__emoji-label" for="emoji-sleeping">
    <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
  </label>

  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
  <label class="film-details__emoji-label" for="emoji-puke">
    <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
  </label>

  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
  <label class="film-details__emoji-label" for="emoji-angry">
    <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
  </label>
</div>
</div>`;

const createFilmPopupTemplate = (data) => `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${data.filmInfo.poster}" alt="">

          <p class="film-details__age">${data.filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${data.filmInfo.title}</h3>
              <p class="film-details__title-original">${data.filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${data.filmInfo.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${data.filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${getAllHumans(data.filmInfo.writers)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${getAllHumans(data.filmInfo.actors)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(data.filmInfo.release.date).format('DD MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${calculateRuntime(data.filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${data.filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${data.filmInfo.genre.length > 1? 'Genres': 'Genre'} </td>
              <td class="film-details__cell">${getAllGenres(data.filmInfo.genre)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${data.filmInfo.description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${checkUserDetailsForPopup(data.userDetails.isWatchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${checkUserDetailsForPopup(data.userDetails.isAlreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${checkUserDetailsForPopup(data.userDetails.isFavorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">${!isOnline() ? 'не удалось загрузить комментарии' : `Comments <span class="film-details__comments-count"> ${data.comments.length}</span>`}</h3>
          ${isOnline() ? renderComments(data) : ''}
          ${isOnline() ? createFormNewComment(data) : ''}
      </section>
    </div>
  </form>
  </section>`;

class FilmPopup extends SmartView{
  constructor(card){
    super();
    this._data = FilmPopup.parseFilmCardToData(card);
    this._onEmotionClick = this._onEmotionClick.bind(this);
    this._onCloseButtonClick = this._onCloseButtonClick.bind(this);
    this._onWatchedClick = this._onWatchedClick.bind(this);
    this._onWatchlistClick = this._onWatchlistClick.bind(this);
    this._onFavoriteClick = this._onFavoriteClick.bind(this);
    this._onDeleteCommentClick = this._onDeleteCommentClick.bind(this);
    this._onNewCommentSubmit = this._onNewCommentSubmit.bind(this);
    this._onCommentIntput = this._onCommentIntput.bind(this);
    this.getElementOfDeletingComment = this.getElementOfDeletingComment.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  getElementOfDeletingComment(){
    return this.getElement().querySelectorAll('.film-details__comment')[this._data.comments.indexOf(this._data.commentToDelete)];
  }

  getElementOfNewComment(){
    return this.getElement().querySelector('.film-details__new-comment');
  }

  _changeEmotion(newEmotion){
    const createEmotionElement = (emotion) => createElement(`<div class="film-details__add-emoji-label">
      ${emotion ? `<img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji">` : ''}
      </div>`);
    const oldEmotionElement = document.querySelector('.film-details__add-emoji-label');
    const newEmotionElement = createEmotionElement(newEmotion);

    replace(newEmotionElement, oldEmotionElement);
  }

  _onEmotionClick(evt){
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;
    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          emotion : evt.target.value,
        },
      ),
    }, true);
    this._changeEmotion(evt.target.value);
    this.getElement().scrollTop = scrollTopPosition;
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((emotion) => {
        if(emotion.value === evt.target.value){
          emotion.setAttribute('checked', 'true');
        }
      });
  }

  _onCloseButtonClick(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _onWatchlistClick(evt) {
    evt.preventDefault();
    this._callback.onWatchlistClick(this._data);
  }

  _onWatchedClick(evt) {
    evt.preventDefault();
    this._callback.onWatchedClick(this._data);
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    this._callback.onFavoriteClick(this._data);
  }

  _onNewCommentSubmit(evt) {
    evt.preventDefault;
    if(evt.key === KeyCode.ENTER && evt.ctrlKey){
      this._data.newComment = this._createNewComment();
      const scrollTopPosition = this.getElement().scrollTop;
      this._callback.onSubmitNewComment(this._data);
      document.querySelector('.film-details').scrollTop = scrollTopPosition;
    }
  }

  _createNewComment(){
    if(!this._data.newComment.commentText){
      throw new Error('Please, write new comment');
    }
    if(!this._data.newComment.emotion){
      throw new Error('Please, choose emotion');
    }
    return{
      comment: he.encode(this._data.newComment.commentText),
      emotion: this._data.newComment.emotion,
    };
  }

  _onDeleteCommentClick(evt) {
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;
    this._data.commentToDelete = this._data.comments.filter((comment) => comment.id === evt.target.dataset.id)[0];
    this._callback.onDeleteClick(FilmPopup.getDataWithoutDeleteComment(this._data));
    document.querySelector('.film-details').scrollTop = scrollTopPosition;
  }

  _onCommentIntput(evt){
    evt.preventDefault();
    this.updateData({
      newComment: Object.assign(
        {},
        this._data.newComment,
        {
          commentText : evt.target.value,
        },
      ),
    },true);
  }

  setOnCloseButtonClick(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._onCloseButtonClick);
  }

  setOnWatchlistClick(callback) {
    this._callback.onWatchlistClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._onWatchlistClick);
  }

  setOnWatchedClick(callback) {
    this._callback.onWatchedClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._onWatchedClick);
  }

  setOnFavoriteClick(callback) {
    this._callback.onFavoriteClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._onFavoriteClick);
  }

  setOnDeleteCommentClick(callback) {
    if(isOnline()){
      this._callback.onDeleteClick = callback;
      this.getElement()
        .querySelectorAll('.film-details__comment-delete')
        .forEach((button) => button.addEventListener('click', this._onDeleteCommentClick));
    }
  }

  setOnNewCommentSubmit(callback) {
    if(isOnline()){
      this._callback.onSubmitNewComment = callback;
      this.getElement()
        .querySelector('.film-details__comment-input')
        .addEventListener('keydown', this._onNewCommentSubmit);
    }
  }

  _setInnerHandlers(){
    if(isOnline()){
      this.getElement()
        .querySelectorAll('.film-details__emoji-item')
        .forEach((emotion) => emotion.addEventListener('click', this._onEmotionClick));
      this.getElement()
        .querySelector('.film-details__comment-input')
        .addEventListener('input', this._onCommentIntput);
    }
  }

  restoreHandlers(){
    this._setInnerHandlers();
    this.setOnFavoriteClick(this._callback.onFavoriteClick);
    this.setOnWatchedClick(this._callback.onWatchedClick);
    this.setOnWatchlistClick(this._callback.onWatchlistClick);
    this.setOnCloseButtonClick(this._callback.closeButtonClick);
    this.setOnDeleteCommentClick(this._callback.onDeleteClick);
    this.setOnNewCommentSubmit(this._callback.onSubmitNewComment);
  }

  static parseFilmCardToData(filmCard) {
    return Object.assign(
      {},
      filmCard,
      {
        newComment: {
          emotion: null,
          commentText: null,
        },
        commentToDelete: null,
        isDisabledForm: false,
        isDeleting: false,
        isDisabledComment : false,
      },
    );
  }

  static getDataWithoutDeleteComment(data) {
    data = Object.assign(
      {},
      data,
      {
        comments: data.comments.filter((comment) => comment.id !== data.commentToDelete.id),
      },
    );

    if (!data.newComment) {
      data.newComment = null;
    }

    delete data.newComment;
    delete data.isDisabled;
    delete data.isDeleting;

    return data;
  }

  reset(filmCard){
    this.updateData(
      FilmPopup.parseFilmCardToData(filmCard),
    );
  }
}

export default FilmPopup;
