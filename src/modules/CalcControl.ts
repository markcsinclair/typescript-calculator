import { CalcDisplay } from './CalcDisplay';
import { CalcModel, Entry } from './CalcModel';

export class CalcControl {
    calcDisplay: CalcDisplay ;
    calcModel: CalcModel;
    handleUpdate: (value: string) => void;
    shouldClear: boolean;

    constructor(display: CalcDisplay, model: CalcModel, update: (value: string) => void) {
        this.calcDisplay  = display;
        this.calcModel    = model;
        this.handleUpdate = update;
        this.shouldClear  = false;
    }

    buttonPressed(value: string) {
        if (/[\d\.]/.test(value)) { // digit or decimal point
            console.log("digit:"+value);
            if (this.shouldClear) {
                this.calcDisplay.clear();
                this.shouldClear = false;
            }
            this.calcDisplay.appendToDisplay(value);
        } else if (value == '=') {
            console.log("evaluate:"+value);
            this.calcModel.pushEntry({type: 'number', value: this.calcDisplay.onDisplay});
            const theResult = this.calcModel.evaluate();
            if (this.calcModel.hasError()) {
                this.calcDisplay.error();
            } else {
                this.calcDisplay.setDisplay(theResult.toString());
            }
            this.shouldClear = true;
        } else if (value == 'C') {
            console.log("clear:"+value);
            this.calcModel.clear();
            this.calcDisplay.clear();
            this.shouldClear = false;
        } else {
            console.log("op:"+value);
            this.calcModel.pushEntry({type: 'number', value: this.calcDisplay.onDisplay});
            this.shouldClear = true;
            this.calcModel.pushEntry({type: 'operator', value: value});
            if (this.calcModel.arity(value) == 1) {
                const theResult = this.calcModel.evaluate();
                if (this.calcModel.hasError()) {
                    this.calcDisplay.error();
                } else {
                    this.calcDisplay.setDisplay(theResult.toString());
                }
            }
        }
        this.handleUpdate(this.calcDisplay.onDisplay);
    };
}