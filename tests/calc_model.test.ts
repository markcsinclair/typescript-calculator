import { CalcModel } from '../src/modules/CalcModel';
import { expect } from 'chai';
import 'mocha';

describe('CalcModel', () => {
    it('Can be instantiated', () => {
        const model = new CalcModel();
        expect(model).is.instanceOf(CalcModel);
      });

    it('Has an initialised list of operators', () => {
        const model = new CalcModel();
        ['+', '-', '*', '/', '^'].forEach((opName: string) => { expect(model.ops.get(opName).name).to.equal(opName); });
    })

    it('Can push number Entry', () => {
        const model = new CalcModel();
        const entry = {type: 'number', value: '1'};
        model.pushEntry(entry);
        expect(model.history).to.deep.equal([entry]);
    })
});