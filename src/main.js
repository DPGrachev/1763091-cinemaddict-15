import { render, RenderPosition } from './utils.js';
import SiteMenuView from './view/site-menu.js';
import HeaderProfileView from './view/header-profile.js';
import MovieCountView from './view/movie-count.js';
import {generateFilmCard} from './mock/film-card-mock.js';
import { generateFilter } from './mock/filter.js';
import ContentBoardPresenter from './presenter/content-board.js';

const FILMS_COUNT = 20;

const filmCards = new Array(FILMS_COUNT).fill().map(generateFilmCard);
const filters = generateFilter(filmCards);
const headerElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new HeaderProfileView(filters.alreadyWatched), RenderPosition.BEFOREEND);
render(siteMainElement,new SiteMenuView(filters), RenderPosition.BEFOREEND);

const contentBoard = new ContentBoardPresenter(siteMainElement);
contentBoard.init(filmCards);
render(footerElement,new MovieCountView(filmCards), RenderPosition.BEFOREEND);
