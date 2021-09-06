import dayjs from 'dayjs';
import he from 'he';
import { nanoid } from 'nanoid';
import SmartView from './smart';
import RelativeTime from 'dayjs/plugin/relativeTime';
import { KeyCode } from '../utils/const';
dayjs.extend(RelativeTime);

const calculateRuntime = (runtime) => {
  const hours = Math.floor(runtime/60);
  const minutes = runtime%60;
  return `${hours}h ${minutes}m`;
};
const getAllGenres = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span> `).join(' ');

const getAllPeople = (peopleArray) => peopleArray.map((people) => people).join(', ');
const checkUserDetailsForPopup = (userDetails) => {
  if(userDetails){
    return 'film-details__control-button--active';
  }
};

const createComment = (comment) => `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${dayjs().to(dayjs(comment.date))}</span>
        <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
      </p>
    </div>
    </li>`;

const renderComments = (comments) => {
  const allComments = comments.map((comment) => createComment(comment)).join(' ');
  return `<ul class="film-details__comments-list">
    ${allComments}
  </ul>`;
};

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
              <td class="film-details__cell">${getAllPeople(data.filmInfo.writers)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${getAllPeople(data.filmInfo.actors)}</td>
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
              <td class="film-details__term">Genres</td>
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
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${data.comments.length}</span></h3>
          ${renderComments(data.comments)}
        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
           ${data.emotion ? `<img src="./images/emoji/${data.emotion}.png" width="55" height="55" alt="emoji">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${data.commentText ? data.commentText : ''}</textarea>
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
        </div>
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
    this._onSubmitNewComment = this._onSubmitNewComment.bind(this);
    this._commentIntputHandler = this._commentIntputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  _onEmotionClick(evt){
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;
    this.updateData({
      emotion : evt.target.value,
    });
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
    const scrollTopPosition = this.getElement().scrollTop;
    this._callback.onWatchlistClick(this._data);
    if (document.querySelector('.film-details')){
      document.querySelector('.film-details').scrollTop = scrollTopPosition;
    }
  }

  _onWatchedClick(evt) {
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;
    this._callback.onWatchedClick(this._data);
    if (document.querySelector('.film-details')){
      document.querySelector('.film-details').scrollTop = scrollTopPosition;
    }
  }

  _onFavoriteClick(evt) {
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;
    this._callback.onFavoriteClick(this._data);
    if (document.querySelector('.film-details')){
      document.querySelector('.film-details').scrollTop = scrollTopPosition;
    }
  }

  _onSubmitNewComment(evt) {
    evt.preventDefault;
    if(evt.key === KeyCode.ENTER && evt.ctrlKey){
      this._data.comments.push(this._createNewComment());
      const scrollTopPosition = this.getElement().scrollTop;
      this._callback.onSubmitNewComment(FilmPopup.parseDataToFilmCard(this._data));
      document.querySelector('.film-details').scrollTop = scrollTopPosition;
    }
  }

  _createNewComment(){
    if(!this._data.commentText){
      throw new Error('Please, write new comment');
    }
    if(!this._data.emotion){
      throw new Error('Please, choose emotion');
    }
    return{
      id: nanoid(),
      author: 'Dmitrii Grachev',
      comment: he.encode(this._data.commentText),
      date: dayjs(),
      emotion: this._data.emotion,
    };
  }

  _onDeleteCommentClick(evt) {
    evt.preventDefault();
    const scrollTopPosition = this.getElement().scrollTop;
    this._data.comments = this._data.comments.filter((comment) => comment.id !== evt.target.dataset.id);
    this._callback.onDeleteClick(FilmPopup.parseDataToFilmCard(this._data));
    document.querySelector('.film-details').scrollTop = scrollTopPosition;
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
    this._callback.onDeleteClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((button) => button.addEventListener('click', this._onDeleteCommentClick));
  }

  setSubmitNewComment(callback) {
    this._callback.onSubmitNewComment = callback;
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('keydown', this._onSubmitNewComment);
  }

  _setInnerHandlers(){
    this.getElement()
      .querySelectorAll('.film-details__emoji-item')
      .forEach((emotion) => emotion.addEventListener('click', this._onEmotionClick));
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentIntputHandler);
  }

  restoreHandlers(){
    this._setInnerHandlers();
    this.setOnFavoriteClick(this._callback.onFavoriteClick);
    this.setOnWatchedClick(this._callback.onWatchedClick);
    this.setOnWatchlistClick(this._callback.onWatchlistClick);
    this.setOnCloseButtonClick(this._callback.closeButtonClick);
    this.setOnDeleteCommentClick(this._callback.onDeleteClick);
    this.setSubmitNewComment(this._callback.onSubmitNewComment);
  }

  _commentIntputHandler(evt){
    evt.preventDefault();
    this.updateData({
      commentText : evt.target.value,
    },true);
  }

  static parseFilmCardToData(filmCard) {
    return Object.assign(
      {},
      filmCard,
      {
        emotion: null,
        commentText: null,
      },
    );
  }

  static parseDataToFilmCard(data) {
    data = Object.assign({}, data);

    if (!data.emotion) {
      data.emotion = null;
    }
    if (!data.commentText) {
      data.commentText = null;
    }

    delete data.emotion;
    delete data.commentText;

    return data;
  }

  reset(filmCard){
    this.updateData(
      FilmPopup.parseFilmCardToData(filmCard),
    );
  }
}

export default FilmPopup;
