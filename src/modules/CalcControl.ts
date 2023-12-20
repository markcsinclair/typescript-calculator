import { CalcDisplay } from './CalcDisplay';
import { CalcModel, Entry } from './CalcModel';

export class CalcControl {
    calcDisplay: CalcDisplay ;
    calcModel: CalcModel;
    handleUpdate: (value: string) => void;
    shouldClearDisplay: boolean;

    constructor(display: CalcDisplay, model: CalcModel, update: (value: string) => void) {
        this.calcDisplay         = display;
        this.calcModel           = model;
        this.handleUpdate        = update;
        this.shouldClearDisplay  = false;
    }

    buttonPressed(value: string) {
        if (/[\d\.]/.test(value)) { // digit or decimal point
            if (this.shouldClearDisplay) {
                this.calcDisplay.clear();
                this.shouldClearDisplay = false;
            }
            this.calcDisplay.appendToDisplay(value);
        } else if (value == '=') {
            this.calcModel.pushEntry({type: 'number', value: this.calcDisplay.onDisplay});
            const theResult = this.calcModel.evaluate();
            if (this.calcModel.hasError()) {
                this.calcDisplay.error();
            } else {
                this.calcDisplay.setDisplay(theResult.toString());
            }
            this.shouldClearDisplay = true;
        } else if (value == 'C') {
            this.calcModel.clear();
            this.calcDisplay.clear();
            this.shouldClearDisplay = false;
        } else {
            this.calcModel.pushEntry({type: 'number', value: this.calcDisplay.onDisplay});
            this.shouldClearDisplay = true;
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