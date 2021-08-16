import dayjs from 'dayjs';

const calculateRuntime = (runtime) => {
  const hours = Math.floor(runtime/60);
  const minutes = runtime%60;
  return `${hours}h ${minutes}m`;
};
const getAllGenres = (genres) => {
  let allGenres = '';
  for (let i=0; i < genres.length; i++ ){
    allGenres += `<span class="film-details__genre">${genres[i]}</span> `;
  }
  return allGenres;
};
const getAllPeople = (peopleArray) => {
  let allPeople = '';
  for (let i=0; i < peopleArray.length; i++ ){
    if (i>0){
      allPeople += `, ${peopleArray[i]}`;
    }else{
      allPeople += `${peopleArray[i]}`;
    }
  }
  return allPeople;
};
const checkUserDetailsForPopup = (userDetails) => {
  if(userDetails){
    return 'film-details__control-button--active';
  }
};
const renderComments = (comments) => {
  let allComments = '';
  for (let i=0; i < comments.length; i++){
    allComments +=
    `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comments[i].emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comments[i].comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comments[i].author}</span>
        <span class="film-details__comment-day">${dayjs(comments[i].date).format('YYYY/MM/D HH:mm')}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`;
  }
  return allComments;
};

const createFilmPopupTemplate = (card) => `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${card.filmInfo.poster}" alt="">

          <p class="film-details__age">${card.filmInfo.ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${card.filmInfo.title}</h3>
              <p class="film-details__title-original">${card.filmInfo.alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${card.filmInfo.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${card.filmInfo.director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${getAllPeople(card.filmInfo.writers)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${getAllPeople(card.filmInfo.actors)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${dayjs(card.filmInfo.release.date).format('D MMMM YYYY')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${calculateRuntime(card.filmInfo.runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${card.filmInfo.release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">${getAllGenres(card.filmInfo.genre)}</td>
            </tr>
          </table>

          <p class="film-details__film-description">${card.filmInfo.description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${checkUserDetailsForPopup(card.userDetails.isWatchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${checkUserDetailsForPopup(card.userDetails.isAlreadyWatched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${checkUserDetailsForPopup(card.userDetails.isFavorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${card.comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${renderComments(card.comments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
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

export {createFilmPopupTemplate};
