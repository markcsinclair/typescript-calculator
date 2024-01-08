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
        expect(display.onDisplay).to.equal('0');
      });

      it('Can have the display set', () => {
        expect(display.onDisplay).to.equal('0');
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
      });

      it('Can handle not appending empty strings', () => {
        expect(display.onDisplay).to.equal('0');
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        const success = display.appendToDisplay('');
        expect(display.onDisplay).to.equal('1');
        expect(success).be.false;
      });

      it('Can handle not appending invalid strings', () => {
        expect(display.onDisplay).to.equal('0');
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        const success = display.appendToDisplay('X');
        expect(display.onDisplay).to.equal('1');
        expect(success).be.false;
      });

      it('Can handle not appending repeat decimal points', () => {
        expect(display.onDisplay).to.equal('0');
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        let success = display.appendToDisplay('.');
        expect(display.onDisplay).to.equal('1.');
        expect(success).be.true;
        success = display.appendToDisplay('0');
        expect(display.onDisplay).to.equal('1.0');
        expect(success).be.true;
        success = display.appendToDisplay('.');
        expect(display.onDisplay).to.equal('1.0');
        expect(success).be.false;
      });

      it('Can handle appending over-length strings', () => {
        expect(display.onDisplay).to.equal('0');
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        const success = display.appendToDisplay('23');
        expect(display.onDisplay).to.equal('12');
        expect(success).be.true;
      });

      it('Can handle replacing a zero display', () => {
        expect(display.onDisplay).to.equal('0');
        const success = display.appendToDisplay('1');
        expect(display.onDisplay).to.equal('1');
        expect(success).be.true;
      });

      it('Can handle replacing an error display', () => {
        expect(display.onDisplay).to.equal('0');
        display.error();
        expect(display.hasError()).be.true;
        const success = display.appendToDisplay('1');
        expect(display.onDisplay).to.equal('1');
        expect(display.hasError()).be.false;
        expect(success).be.true;
      });

      it('Can append to display', () => {
        expect(display.onDisplay).to.equal('0');
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        let success = display.appendToDisplay('2');
        expect(display.onDisplay).to.equal('12');
        expect(success).be.true;
        success = display.appendToDisplay('.');
        expect(display.onDisplay).to.equal('12.');
        expect(success).be.true;
        success = display.appendToDisplay('3');
        expect(display.onDisplay).to.equal('12.3');
        expect(success).be.true;
      });

      it('Can report zero', () => {
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        expect(display.isZero()).be.false;
        display.setDisplay('0');
        expect(display.onDisplay).to.equal('0');
        expect(display.isZero()).be.true;
        display.setDisplay('-0');
        expect(display.onDisplay).to.equal('-0');
        expect(display.isZero()).be.true;
      });

      it('Can report decimal point', () => {
        display.setDisplay('1');
        expect(display.onDisplay).to.equal('1');
        expect(display.hasDecimalPoint()).be.false;
        display.setDisplay('1.0');
        expect(display.onDisplay).to.equal('1.0');
        expect(display.hasDecimalPoint()).be.true;
        display.setDisplay('-1.0');
        expect(display.onDisplay).to.equal('-1.0');
        expect(display.hasDecimalPoint()).be.true;
      });
});