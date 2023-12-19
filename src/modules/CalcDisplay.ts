
const errorString = 'error';

export class CalcDisplay {
    onDisplay: string;

    constructor() {
        this.onDisplay = '0';
    }

    setDisplay(str: string): void {
        this.onDisplay = str;
    }

    appendToDisplay(str: string): boolean {
        const re = /[.0-9]+/;
        if (!str || !re.test(str) || this.hasDecimalPoint()) { // empty or invalid str or repeat decimal point
            return false;
        }
        if (str.length > 1) { // str has more than one character
            str = str.slice(0,1);
        }
        if (this.isZero() || this.hasError()) { // replace rather than append
            this.onDisplay = str;
        } else { // append
            this.onDisplay += str;
        }
        return true;
    }

    isZero(): boolean {
        return (this.onDisplay == '0' || this.onDisplay == '-0') ? true : false;
    }

    hasDecimalPoint(): boolean {
        const re = /-?[0-9]+\.[0-9]+/;
        return re.test(this.onDisplay);
    }

    hasError(): boolean {
        return this.onDisplay == errorString;
    }

    clear(): void {
        this.onDisplay = '0';
    }

    error(): void {
        this.onDisplay = errorString;
    }
}