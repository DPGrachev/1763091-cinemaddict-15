const createMovieCountTemplate = (AllMovies) => (
  `<section class="footer__statistics">
  <p>${AllMovies.length} movies inside</p>
  </section>`
);

export {createMovieCountTemplate};
