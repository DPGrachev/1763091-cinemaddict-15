import { render, remove, RenderPosition, KeyCode } from './utils.js';
import SiteMenuView from './view/site-menu.js';
import HeaderProfileView from './view/header-profile.js';
import SortFilmsView from './view/sort-films.js';
import ContentAreaView from './view/content-area.js';
import EmptyFilmsListView from './view/empty-films-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import MovieCountView from './view/movie-count.js';
import FilmPopupView from './view/film-popup.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import { generateFilter } from './mock/filter.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const FILMS_COUNT = 21;

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);
const filters = generateFilter(filmCards);
const movieSortByRating = filmCards.slice().sort((a,b)=> b.filmInfo.rating - a.filmInfo.rating);
const movieSortByComments = filmCards.slice().sort((a,b)=> b.comments.length - a.comments.length);

const bodyElement = document.querySelector('body');
const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderFilmCard = (filmCardsContainer, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmPopupComponent = new FilmPopupView(filmCard);

  const onEscKeyDown = (evt) => {
    if (evt.key === KeyCode.ESCAPE) {
      evt.preventDefault();
      bodyElement.removeChild(bodyElement.querySelector('.film-details'));
      bodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  const renderPopupOnClick = () => {
    if (bodyElement.querySelector('.film-details')){
      document.removeEventListener('keydown', onEscKeyDown);
      bodyElement.removeChild(bodyElement.querySelector('.film-details'));
    }
    bodyElement.classList.add('hide-overflow');
    bodyElement.appendChild(filmPopupComponent.getElement());

    document.addEventListener('keydown',onEscKeyDown);
    bodyElement.appendChild(filmPopupComponent.getElement());
    filmPopupComponent.setOnCloseButtonClick(() => {
      bodyElement.removeChild(filmPopupComponent.getElement());
      bodyElement.classList.remove('hide-overflow');
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };

  filmCardComponent.setOnClick(() => {
    renderPopupOnClick();
  });

  render(filmCardsContainer, filmCardComponent, RenderPosition.BEFOREEND);
};

render(headerElement, new HeaderProfileView(filters.alreadyWatched), RenderPosition.BEFOREEND);
render(siteMainElement,new SiteMenuView(filters), RenderPosition.BEFOREEND);
render(siteMainElement,new SortFilmsView(), RenderPosition.BEFOREEND);

const renderContentArea = (filmsContainer, films) => {

  if(filmCards.length === 0){
    render(filmsContainer, new EmptyFilmsListView(), RenderPosition.BEFOREEND);
    return;
  }

  const contentArea = new ContentAreaView();
  const filmListElement = contentArea.getElement().querySelector('.main-films-list');

  render(filmsContainer,contentArea, RenderPosition.BEFOREEND);
  for (let i=0; i< Math.min(FILMS_COUNT_PER_STEP, films.length); i++){
    renderFilmCard(filmListElement ,films[i]);
  }

  if(films.length > FILMS_COUNT_PER_STEP){
    let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    const filmsList = document.querySelector('.films-list');
    const showMoreButton = new ShowMoreButtonView();

    render(filmsList,showMoreButton, RenderPosition.BEFOREEND);
    showMoreButton.setClickHandler(() => {
      films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
        .forEach((card) => renderFilmCard(filmListElement,card));
      renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
      if(renderedFilmCardsCount >= films.length){
        remove(showMoreButton);
      }
    });
  }
  for (let i=0; i< Math.min(EXTRA_FILMS_COUNT, filmCards.length); i++){
    renderFilmCard(contentArea.getElement().querySelector('.top-rated-films-list'),movieSortByRating[i]);
  }
  for (let i=0; i< Math.min(EXTRA_FILMS_COUNT,filmCards.length); i++){
    renderFilmCard(contentArea.getElement().querySelector('.most-commented-films-list'),movieSortByComments[i]);
  }
};

renderContentArea(siteMainElement, filmCards);
render(footerElement,new MovieCountView(filmCards), RenderPosition.BEFOREEND);
