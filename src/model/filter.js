import AbstractObserver from './abstract-observer';
import { FilterType } from '../utils/const';

class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL;
  }

  setFilter(filter, updateType) {
    this._activeFilter = filter;
    if(updateType){
      this._notify(updateType, filter);
    }
  }

  getFilter() {
    return this._activeFilter;
  }
}

export default Filter;
