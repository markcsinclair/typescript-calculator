import { CalcControl } from '../src/modules/CalcControl';
import { CalcDisplay } from '../src/modules/CalcDisplay';
import { CalcModel } from '../src/modules/CalcModel';
import { expect } from 'chai';
import 'mocha';

describe('Integration', () => {
    let control: CalcControl;
    let display: CalcDisplay;
    let model: CalcModel;
    let handleUpdate: (value: string) => void;

    beforeEach(() => {
        display      = new CalcDisplay();
        model        = new CalcModel();
        handleUpdate = (value: string) => {};
        control      = new CalcControl(display, model, handleUpdate);
    });

    it('Can be instantiated', () => {
        expect(control).is.instanceOf(CalcControl);
    });

    it('Can add two numbers', () => {
        expect(display.onDisplay).to.equal('0');
        control.buttonPressed('1');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('+');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('2');
        expect(display.onDisplay).to.equal('2');
        control.buttonPressed('=');
        expect(display.onDisplay).to.equal('3');
    });

    it('Can add three numbers', () => {
        expect(display.onDisplay).to.equal('0');
        control.buttonPressed('1');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('+');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('2');
        expect(display.onDisplay).to.equal('2');
        control.buttonPressed('+');
        expect(display.onDisplay).to.equal('3'); // automatic evaluation
        control.buttonPressed('4');
        expect(display.onDisplay).to.equal('4');
        control.buttonPressed('=');
        expect(display.onDisplay).to.equal('7');
    });

    it('Can handle divide by zero', () => {
        expect(display.onDisplay).to.equal('0');
        control.buttonPressed('1');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('/');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('0');
        expect(display.onDisplay).to.equal('0');
        control.buttonPressed('=');
        expect(display.onDisplay).to.equal('error');
    });

    it('Operates correctly after divide by zero', () => {
        expect(display.onDisplay).to.equal('0');
        control.buttonPressed('1');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('/');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('0');
        expect(display.onDisplay).to.equal('0');
        control.buttonPressed('=');
        expect(display.onDisplay).to.equal('error');
        control.buttonPressed('1');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('+');
        expect(display.onDisplay).to.equal('1');
        control.buttonPressed('2');
        expect(display.onDisplay).to.equal('2');
        control.buttonPressed('=');
        expect(display.onDisplay).to.equal('3');
    });
});