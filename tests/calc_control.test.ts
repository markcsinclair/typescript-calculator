import { CalcControl } from '../src/modules/CalcControl';
import { CalcDisplay } from '../src/modules/CalcDisplay';
import { CalcModel } from '../src/modules/CalcModel';
import { expect } from 'chai';
import 'mocha';
import sinon, { SinonStubbedInstance } from 'sinon';

describe('CalcControl', () => {
    let control: CalcControl;
    let displayStub: SinonStubbedInstance<CalcDisplay>;
    let modelStub: SinonStubbedInstance<CalcModel>;
    let handleUpdate: (value: string) => void;

    beforeEach(() => {
        displayStub  = sinon.createStubInstance(CalcDisplay);
        modelStub    = sinon.createStubInstance(CalcModel);
        handleUpdate = (value: string) => {};
        control      = new CalcControl(displayStub, modelStub, handleUpdate);
    });

    it('Can handle button pressed for number', () => {
        const append = sinon.stub(control, 'processAppend');
        control.buttonPressed('1');
        expect(append.withArgs('1').calledOnce).be.true;
    });

    it('Can handle button pressed for decimal point', () => {
        const append = sinon.stub(control, 'processAppend');
        control.buttonPressed('.');
        expect(append.withArgs('.').calledOnce).be.true;
    });

    it('Can handle button pressed for evaluate', () => {
        const evaluate = sinon.stub(control, 'processEvaluate');
        control.buttonPressed('=');
        expect(evaluate.calledOnce).be.true;
    });

    it('Can handle button pressed for clear', () => {
        const clear = sinon.stub(control, 'processClear');
        control.buttonPressed('C');
        expect(clear.calledOnce).be.true;
    });

    it('Can handle button pressed for operation', () => {
        const operation = sinon.stub(control, 'processOperation');
        control.buttonPressed('+');
        expect(operation.calledOnce).be.true;
    });

    it('Can process append when should-clear is unset', () => {
        control.shouldClearDisplay = false; 
        control.processAppend('1');
        expect(displayStub.appendToDisplay.withArgs('1').calledOnce).be.true;
    });

    it('Can process append when should-clear is set', () => {
        control.shouldClearDisplay = true; 
        control.processAppend('1');
        expect(displayStub.clear.calledOnce).be.true;
        expect(displayStub.appendToDisplay.withArgs('1').calledOnce).be.true;
        expect(control.shouldClearDisplay).be.false;
    });

    it('Can process evaluate', () => {
        displayStub.onDisplay = '1';
        modelStub.evaluate.returns(2);
        modelStub.hasError.returns(false);
        const setCalcDisplay = sinon.stub(control, 'setCalcDisplay');
        control.processEvaluate();
        expect(modelStub.pushEntry.withArgs({type: 'number', value: '1'}).calledOnce).be.true;
        expect(setCalcDisplay.withArgs(2).calledOnce).be.true;
        expect(control.shouldClearDisplay).be.true;
    });

    it('Can process clear', () => {
        control.processClear();
        expect(displayStub.clear.calledOnce).be.true;
        expect(modelStub.clear.calledOnce).be.true;
        expect(control.shouldClearDisplay).be.false;
    });

    it('Can process operation (not binary ready, arity 2)', () => {
        displayStub.onDisplay = '1';
        modelStub.binaryOpReady.returns(false);
        modelStub.arity.returns(2);
        control.processOperation('+');
        expect(modelStub.pushEntry.withArgs({type: 'number', value: '1'}).calledOnce).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'operator', value: '+'}).calledOnce).be.true;
        expect(control.shouldClearDisplay).be.true;
    });

    it('Can process operation (not binary ready, arity 1)', () => {
        displayStub.onDisplay = '1';
        modelStub.binaryOpReady.returns(false);
        modelStub.arity.returns(1);
        modelStub.evaluate.returns(2);
        modelStub.hasError.returns(false);
        control.processOperation('-/+');
        expect(displayStub.setDisplay.calledOnceWith('2')).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'number', value: '1'}).calledOnce).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'operator', value: '-/+'}).calledOnce).be.true;
        expect(control.shouldClearDisplay).be.true;
    });

    it('Can process operation (binary ready, arity 2)', () => {
        displayStub.onDisplay = '1';
        modelStub.binaryOpReady.returns(true);
        modelStub.evaluate.returns(2);
        modelStub.hasError.returns(false);
        modelStub.arity.returns(2);
        control.processOperation('+');
        expect(displayStub.setDisplay.calledOnceWith('2')).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'number', value: '1'}).calledTwice).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'operator', value: '+'}).calledOnce).be.true;
        expect(control.shouldClearDisplay).be.true;
    });

    it('Can set display when model does not have error', () => {
        modelStub.hasError.returns(false);
        control.setCalcDisplay(1);
        expect(displayStub.setDisplay.calledOnceWith('1')).be.true;
    });

    it('Can set display when model has an error', () => {
        modelStub.hasError.returns(true);
        control.setCalcDisplay(1);
        expect(displayStub.error.calledOnce).be.true;
    });
});


