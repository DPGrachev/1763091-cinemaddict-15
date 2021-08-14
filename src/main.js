import { createSiteMenuTemplate } from './view/site-menu.js';
import { createHeaderProfileTemplate } from './view/header-profile.js';
import { createSortFilmsTemplate } from './view/sort-films.js';
import { createContentAreaTemplate } from './view/content-area.js';
import { createFilmCardTemplate } from './view/film-card.js';
import { createMovieCountTemplate } from './view/movie-count.js';
import { createFilmPopupTemplate } from './view/film-popup.js';

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};
const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, createHeaderProfileTemplate(), 'beforeend');
render(siteMainElement,createSiteMenuTemplate(), 'beforeend');
render(siteMainElement,createSortFilmsTemplate(), 'beforeend');
render(siteMainElement,createContentAreaTemplate(), 'beforeend');
render(footerElement,createMovieCountTemplate(), 'beforeend');
render(footerElement,createFilmPopupTemplate(), 'afterend');

const filmListElement = document.querySelectorAll('.films-list__container')[0];
for (let i=0; i< FILMS_COUNT; i++){
  render(filmListElement,createFilmCardTemplate(), 'beforeend');
}
const topRatedFilmListElement = document.querySelectorAll('.films-list__container')[1];
for (let i=0; i< EXTRA_FILMS_COUNT; i++){
  render(topRatedFilmListElement,createFilmCardTemplate(), 'beforeend');
}
const mostCommentedFilmListElement = document.querySelectorAll('.films-list__container')[2];
for (let i=0; i< EXTRA_FILMS_COUNT; i++){
  render(mostCommentedFilmListElement,createFilmCardTemplate(), 'beforeend');
}
