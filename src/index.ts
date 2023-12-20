import { CalcDisplay } from './modules/CalcDisplay';
import { CalcModel } from './modules/CalcModel';
import { CalcControl } from './modules/CalcControl';

declare interface ElementEvent extends Event {
  currentTarget: HTMLElement;
  target: HTMLElement;
}

function init() {
  const display: HTMLParagraphElement = document.querySelector('p#display');
  const calcDisplay  = new CalcDisplay();
  const calcModel    = new CalcModel();
  const handleUpdate = (value: string) => {
    display.innerText = value ? value : '0';
  };
  const calcControl = new CalcControl(calcDisplay, calcModel, handleUpdate);

  const calcBtns = document.querySelectorAll('.calcButton');

  const handleBtnClick = (e: ElementEvent) => {
    const el = e.currentTarget;
    const {value, type} = el.dataset;
    calcControl.buttonPressed(value);
  }

  calcBtns.forEach(btn => btn.addEventListener('click', handleBtnClick));
}

document.addEventListener('DOMContentLoaded', init);