import Abstract from './view/abstract';

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const KeyCode = {
  ESCAPE : 'Escape',
};

const render = (container, element, place) => {
  if(container instanceof Abstract) {
    container = container.getElement();
  }

  if(element instanceof Abstract) {
    element = element.getElement();
  }
  switch (place) {
    case RenderPosition.AFTERBEGIN:{
      container.prepend(element);
      break;
    }
    case RenderPosition.BEFOREEND:{
      container.append(element);
      break;
    }
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export {createElement, replace, render, updateItem, remove, RenderPosition, KeyCode};
