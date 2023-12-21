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
            this.processAppend(value);
        } else if (value == '=') {
            this.processEvaluate();
        } else if (value == 'C') {
            this.processClear();
        } else {
            this.processOperation(value);
        }
        this.handleUpdate(this.calcDisplay.onDisplay);
    };

    processAppend(value: string): void {
        if (this.shouldClearDisplay) {
            this.calcDisplay.clear();
            this.shouldClearDisplay = false;
        }
        this.calcDisplay.appendToDisplay(value);
    };

    processEvaluate(): void {
        this.calcModel.pushEntry({type: 'number', value: this.calcDisplay.onDisplay});
        const theResult = this.calcModel.evaluate();
        this.setCalcDisplay(theResult);
        this.shouldClearDisplay = true;
    };

    processClear(): void {
        this.calcModel.clear();
        this.calcDisplay.clear();
        this.shouldClearDisplay = false;
    };

    processOperation(value: string): void {
        if (this.calcModel.binaryOpReady()) { // provide operator chaining
            this.processEvaluate();
        }
        this.calcModel.pushEntry({type: 'number', value: this.calcDisplay.onDisplay});
        this.shouldClearDisplay = true;
        this.calcModel.pushEntry({type: 'operator', value: value});
        if (this.calcModel.arity(value) == 1) {
            const theResult = this.calcModel.evaluate();
            this.setCalcDisplay(theResult);
        }
    };

    setCalcDisplay(theResult: number): void {
        if (!this.calcModel.hasError()) {
            this.calcDisplay.setDisplay(theResult.toString());
        } else {
            this.calcDisplay.error();
        }
    };
}