import { createSiteMenuTemplate } from './view/site-menu.js';
import { createHeaderProfileTemplate } from './view/header-profile.js';
import { createSortFilmsTemplate } from './view/sort-films.js';
import { createContentAreaTemplate } from './view/content-area.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createShowMoreButton } from './view/shoow-more-button.js';
import { createMovieCountTemplate } from './view/movie-count.js';
import { createFilmPopupTemplate } from './view/film-popup.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import { generateFilter } from './mock/filter.js';

const FILMS_COUNT_PER_STEP = 5;
const EXTRA_FILMS_COUNT = 2;
const FILMS_COUNT = 21;

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);
const filters = generateFilter(filmCards);
const movieSortByRating = filmCards.slice().sort((a,b)=> b.filmInfo.rating - a.filmInfo.rating);
const movieSortByComments = filmCards.slice().sort((a,b)=> b.comments.length - a.comments.length);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, createHeaderProfileTemplate(filters.alreadyWatched), 'beforeend');
render(siteMainElement,createSiteMenuTemplate(filters), 'beforeend');
render(siteMainElement,createSortFilmsTemplate(), 'beforeend');
render(siteMainElement,createContentAreaTemplate(), 'beforeend');
render(footerElement,createMovieCountTemplate(filmCards), 'beforeend');
render(footerElement,createFilmPopupTemplate(filmCards[0]), 'afterend');

const filmListElement = document.querySelectorAll('.films-list__container')[0];
for (let i=0; i< Math.min(FILMS_COUNT_PER_STEP, filmCards.length); i++){
  render(filmListElement,createFilmCardTemplate(filmCards[i]), 'beforeend');
}

if(filmCards.length > FILMS_COUNT_PER_STEP){
  let renderedFilmCardsCount = FILMS_COUNT_PER_STEP;
  const filmsList = document.querySelector('.films-list');

  render(filmsList, createShowMoreButton(), 'beforeend');
  const showMoreButton = filmsList.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    filmCards
      .slice(renderedFilmCardsCount, renderedFilmCardsCount + FILMS_COUNT_PER_STEP)
      .forEach((card) => render(filmListElement,createFilmCardTemplate(card), 'beforeend'));
    renderedFilmCardsCount += FILMS_COUNT_PER_STEP;
    if(renderedFilmCardsCount >= filmCards.length){
      showMoreButton.remove();
    }
  });
}

const topRatedFilmListElement = document.querySelectorAll('.films-list__container')[1];
for (let i=0; i< EXTRA_FILMS_COUNT; i++){
  render(topRatedFilmListElement,createFilmCardTemplate(movieSortByRating[i]), 'beforeend');
}
const mostCommentedFilmListElement = document.querySelectorAll('.films-list__container')[2];
for (let i=0; i< EXTRA_FILMS_COUNT; i++){
  render(mostCommentedFilmListElement,createFilmCardTemplate(movieSortByComments[i]), 'beforeend');
}
