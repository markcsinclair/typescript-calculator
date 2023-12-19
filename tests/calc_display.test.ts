import { CalcDisplay } from '../src/modules/CalcDisplay';
import { expect } from 'chai';
import 'mocha';

describe('CalcDisplay', () => {
    let display: CalcDisplay;

    beforeEach(() => {
        display = new CalcDisplay();
    });

    it('Can be instantiated', () => {
        expect(display).is.instanceOf(CalcDisplay);
        expect(display.onDisplay).to.equal('');
        expect(display.shouldClear).be.false;
      });
});