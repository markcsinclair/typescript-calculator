import { CalcModel } from '../src/modules/CalcModel';
import { expect } from 'chai';
import 'mocha';

const zeroEntry   = {type: 'number', value: '0'};
const oneEntry    = {type: 'number', value: '1'};
const twoEntry    = {type: 'number', value: '2'};
const threeEntry  = {type: 'number', value: '3'};
const fourEntry   = {type: 'number', value: '4'};
const negTwoEntry = {type: 'number', value: '-2'};
const addEntry    = {type: 'operator', value: '+'};
const subEntry    = {type: 'operator', value: '-'};
const mulEntry    = {type: 'operator', value: '*'};
const divEntry    = {type: 'operator', value: '/'};
const powEntry    = {type: 'operator', value: '^'};
const sgnEntry    = {type: 'operator', value: '-/+'};
const invEntry    = {type: 'invalid', value: 'invalid'};
const unkEntry    = {type: 'operator', value: 'unknown'};

describe('CalcModel', () => {
    let model: CalcModel;

    beforeEach(() => {
        model = new CalcModel();
    });

    it('Can be instantiated', () => {
        expect(model).is.instanceOf(CalcModel);
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.false;
      });

    it('Has an initialised list of operators', () => {
        ['+', '-', '*', '/', '^'].forEach((opName: string) => { expect(model.ops.get(opName).name).to.equal(opName); });
    });

    it('Can push number Entry', () => {
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can push operator Entry', () => {
        model.pushEntry(oneEntry);
        model.pushEntry(addEntry);
        expect(model.history).to.deep.equal([oneEntry, addEntry]);
        expect(model.hasError()).be.false;
    });

    it('Cannot push Entry with invalid type', () => {
        model.pushEntry(oneEntry);
        model.pushEntry(invEntry);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
    });

    it('Cannot push operator Entry without prior operand', () => {
        model.pushEntry(addEntry);
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.false;
    });

    it('Can add two numbers', () => {
        model.pushEntry(oneEntry);
        model.pushEntry(addEntry);
        model.pushEntry(twoEntry);
        expect(model.history).to.deep.equal([oneEntry, addEntry, twoEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(3);
        expect(model.history).to.deep.equal([threeEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can subtract two numbers', () => {
        model.pushEntry(twoEntry);
        model.pushEntry(subEntry);
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([twoEntry, subEntry, oneEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(1);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can multiply two numbers', () => {
        model.pushEntry(twoEntry);
        model.pushEntry(mulEntry);
        model.pushEntry(twoEntry);
        expect(model.history).to.deep.equal([twoEntry, mulEntry, twoEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(4);
        expect(model.history).to.deep.equal([fourEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can divide two numbers', () => {
        model.pushEntry(fourEntry);
        model.pushEntry(divEntry);
        model.pushEntry(twoEntry);
        expect(model.history).to.deep.equal([fourEntry, divEntry, twoEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(2);
        expect(model.history).to.deep.equal([twoEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can catch divide by zero', () => {
        model.pushEntry(oneEntry);
        model.pushEntry(divEntry);
        model.pushEntry(zeroEntry);
        expect(model.history).to.deep.equal([oneEntry, divEntry, zeroEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(0);
        expect(model.history).to.deep.equal([zeroEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can raise a number to a power', () => {
        model.pushEntry(twoEntry);
        model.pushEntry(powEntry);
        model.pushEntry(twoEntry);
        expect(model.history).to.deep.equal([twoEntry, powEntry, twoEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(4);
        expect(model.history).to.deep.equal([fourEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can change the sign of a positive number', () => {
        model.pushEntry(twoEntry);
        model.pushEntry(sgnEntry);
        expect(model.history).to.deep.equal([twoEntry, sgnEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(-2);
        expect(model.history).to.deep.equal([negTwoEntry]);
        expect(model.hasError()).be.false;
    });

    it('Can change the sign of a negative number', () => {
        model.pushEntry(negTwoEntry);
        model.pushEntry(sgnEntry);
        expect(model.history).to.deep.equal([negTwoEntry, sgnEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(2);
        expect(model.history).to.deep.equal([twoEntry]);
        expect(model.hasError()).be.false;
    });

    it('Sets error when evaluating empty history', () => {
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(0);
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.true;
    });

    it('Can catch missing operator (empty), arity 2', () => {
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(0);
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.true;
    });

    it('Can catch missing operator (number), arity 2', () => {
        model.pushEntry(oneEntry);
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([oneEntry, oneEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(0);
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.true;
    });

    it('Can catch missing operand, arity 2', () => {
        model.pushEntry(oneEntry);
        model.pushEntry(addEntry);
        expect(model.history).to.deep.equal([oneEntry, addEntry]);
        expect(model.hasError()).be.false;
        const theResult = model.evaluate();
        expect(theResult).to.equal(0);
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.true;
    });

    it('Can return top Entry', () => {
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
        expect(model.topEntry()).to.equal(oneEntry);
        expect(model.history).to.deep.equal([oneEntry]);
    });

    it('Returns undefined for top Entry when history is empty', () => {
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.false;
        expect(model.topEntry()).to.undefined;
    });

    it('Can clear history', () => {
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
        model.clear();
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.false;
    });

    it('Can set error state', () => {
        model.pushEntry(oneEntry);
        expect(model.history).to.deep.equal([oneEntry]);
        expect(model.hasError()).be.false;
        model.error();
        expect(model.history).to.deep.equal([]);
        expect(model.hasError()).be.true;
    });

    it('Can provide correct op arities', () => {
        expect(model.arity('+')).to.equal(2);
        expect(model.arity('-/+')).to.equal(1);
        expect(model.arity('unknown')).to.equal(0);
    });
});