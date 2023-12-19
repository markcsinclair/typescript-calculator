export class CalcDisplay {
    onDisplay: string;
    shouldClear: boolean;

    constructor() {
        this.onDisplay   = '';
        this.shouldClear = false;
    }

    hasDecimalPoint(): boolean {
        const re = /-?[0-9]+\.[0-9]+/;
        return re.test(this.onDisplay);
    }

    clear(): void {
        this.onDisplay = '';
    }

    error(): void {
        this.onDisplay = 'Error';
    }
}