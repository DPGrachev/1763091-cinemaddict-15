import AbstractView from './abstract';

const getUserRank = (wachedMovies) => {
  if(wachedMovies === 0){
    return '';
  }
  if(wachedMovies <= 10){
    return '<p class="profile__rating">Novice</p>';
  }
  if(wachedMovies <= 20){
    return '<p class="profile__rating">Fan</p>';
  }
  if(wachedMovies >= 21){
    return '<p class="profile__rating">Movie Buff</p>';
  }
};

const createHeaderProfileTemplate = (wachedMovies) => (
  `<section class="header__profile profile">
  ${getUserRank(wachedMovies)}
  <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`
);

class HeaderProfile extends AbstractView{
  constructor(wachedMovies){
    super();
    this._wachedMovies = wachedMovies;
  }

  getTemplate() {
    return createHeaderProfileTemplate(this._wachedMovies);
  }
}

export default HeaderProfile;
