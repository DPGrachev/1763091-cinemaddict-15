import { render, RenderPosition } from './utils/render.js';
import MovieCountView from './view/movie-count.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import FilmsModel from './model/movies.js';
import FilterModel from './model/filter.js';
import ContentBoardPresenter from './presenter/content-board.js';

const FILMS_COUNT = 35;

const filmCardsWithoutWatchingDate = new Array(FILMS_COUNT).fill().map(generateFilmCard);
const filmCards = filmCardsWithoutWatchingDate.map((filmCard) => {
  if(filmCard.userDetails.isAlreadyWatched){
    filmCard.userDetails.watchingDate = filmCard.filmInfo.release.date;
  }
  return filmCard;
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const filterModel = new FilterModel();

const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const contentBoard = new ContentBoardPresenter(siteMainElement, filmsModel, filterModel);
const siteMenu = new SiteMenuPresenter(siteMainElement,headerElement, filterModel, filmsModel,contentBoard);

siteMenu.init();
contentBoard.init();
render(footerElement,new MovieCountView(filmCards), RenderPosition.BEFOREEND);
