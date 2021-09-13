import AbstractView from './abstract';

const createMostCommentedFilmsTemplate = () => `<section class="films-list films-list--extra most-commented-container">
  <h2 class="films-list__title">Most commented</h2>
  <div class="films-list__container most-commented-films-list">  
  </div>
  </section>`;

class MostCommentedFilmsComponent extends AbstractView{
  getTemplate(){
    return createMostCommentedFilmsTemplate();
  }
}

export default MostCommentedFilmsComponent;
