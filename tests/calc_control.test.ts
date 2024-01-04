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
        const processAppend = sinon.stub(control, 'processAppend');
        control.buttonPressed('1');
        expect(processAppend.withArgs('1').calledOnce).be.true;
    });

    it('Can handle button pressed for decimal point', () => {
        const processAppend = sinon.stub(control, 'processAppend');
        control.buttonPressed('.');
        expect(processAppend.withArgs('.').calledOnce).be.true;
    });

    it('Can handle button pressed for evaluate', () => {
        const processEvaluate = sinon.stub(control, 'processEvaluate');
        control.buttonPressed('=');
        expect(processEvaluate.calledOnce).be.true;
    });

    it('Can handle button pressed for clear', () => {
        const processClear = sinon.stub(control, 'processClear');
        control.buttonPressed('C');
        expect(processClear.calledOnce).be.true;
    });

    it('Can handle button pressed for operation', () => {
        const processOperation = sinon.stub(control, 'processOperation');
        control.buttonPressed('+');
        expect(processOperation.calledOnce).be.true;
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
        modelStub.evaluate.returns(-1);
        const setCalcDisplay = sinon.stub(control, 'setCalcDisplay');
        control.processOperation('-/+');
        expect(modelStub.pushEntry.withArgs({type: 'number', value: '1'}).calledOnce).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'operator', value: '-/+'}).calledOnce).be.true;
        expect(modelStub.evaluate.calledOnce).be.true;
        expect(setCalcDisplay.withArgs(-1).calledOnce).be.true;
        expect(control.shouldClearDisplay).be.true;
    });

    it('Can process operation (binary ready, arity 2)', () => {
        displayStub.onDisplay = '1';
        modelStub.binaryOpReady.returns(true);
        modelStub.arity.returns(2);
        const processEvaluate = sinon.stub(control, 'processEvaluate');
        control.processOperation('+');
        expect(processEvaluate.calledOnce).be.true;
        expect(modelStub.pushEntry.withArgs({type: 'number', value: '1'}).calledOnce).be.true;
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



