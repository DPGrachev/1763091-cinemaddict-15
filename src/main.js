import { render, RenderPosition, KeyCode } from './utils.js';
import SiteMenuView from './view/site-menu.js';
import HeaderProfileView from './view/header-profile.js';
import SortFilmsView from './view/sort-films.js';
import ContentAreaView from './view/content-area.js';
import EmptyFilmsListView from './view/empty-films-list.js';
import FilmCardView from './view/film-card.js';
import ShowMoreButtonView from './view/shoow-more-button.js';
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

  const closePopup = () => {
    bodyElement.removeChild(filmPopupComponent.getElement());
    filmPopupComponent.getElement().querySelector('.film-details__close-btn').removeEventListener('click', closePopup);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === KeyCode.ESCAPE) {
      evt.preventDefault();
      closePopup();
      document.removeEventListener('keydown', onEscKeyDown);
      bodyElement.classList.remove('hide-overflow');
    }
  };

  const renderPopupOnClick = () => {
    if (bodyElement.querySelector('.film-details')){
      bodyElement.removeChild(bodyElement.querySelector('.film-details'));
      filmPopupComponent.getElement().querySelector('.film-details__close-btn').removeEventListener('click', closePopup);
      bodyElement.classList.remove('hide-overflow');
    }
    bodyElement.classList.add('hide-overflow');
    bodyElement.appendChild(filmPopupComponent.getElement());

    filmPopupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click',closePopup);
    document.addEventListener('keydown',onEscKeyDown);
  };

  filmCardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    renderPopupOnClick();
  });
  filmCardComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    renderPopupOnClick();
  });
  filmCardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    renderPopupOnClick();
  });

  render(filmCardsContainer, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

render(headerElement, new HeaderProfileView(filters.alreadyWatched).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement,new SiteMenuView(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement,new SortFilmsView().getElement(), RenderPosition.BEFOREEND);

const renderContentArea = (filmsContainer, films) => {

  if(filmCards.length === 0){
    render(filmsContainer, new EmptyFilmsListView().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  const contentArea = new ContentAreaView();
  const filmsContainers = contentArea.getElement().querySelectorAll('.films-list__container');
  const filmListElement = filmsContainers[0];
  const topRatedFilmListElement = filmsContainers[1];
  const mostCommentedFilmListElement = filmsContainers[2];

  render(filmsContainer,contentArea.getElement(), RenderPosition.BEFOREEND);
  for (let i=0; i< Math.min(FILMS_COUNT_PER_STEP, films.length); i++){
    renderFilmCard(filmListElement,films[i]);
  }

  if(films.length > FILMS_COUNT_PER_STEP){
    let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
    const filmsList = document.querySelector('.films-list');

    render(filmsList,new ShowMoreButtonView().getElement(), RenderPosition.BEFOREEND);
    const showMoreButton = filmsList.querySelector('.films-list__show-more');
    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      films
        .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
        .forEach((card) => renderFilmCard(filmListElement,card));
      renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
      if(renderedFilmCardsCount >= films.length){
        showMoreButton.remove();
      }
    });
  }
  for (let i=0; i< Math.min(EXTRA_FILMS_COUNT, filmCards.length); i++){
    renderFilmCard(topRatedFilmListElement,movieSortByRating[i]);
  }
  for (let i=0; i< Math.min(EXTRA_FILMS_COUNT,filmCards.length); i++){
    renderFilmCard(mostCommentedFilmListElement,movieSortByComments[i]);
  }
};

renderContentArea(siteMainElement, filmCards);
render(footerElement,new MovieCountView(filmCards).getElement(), RenderPosition.BEFOREEND);
