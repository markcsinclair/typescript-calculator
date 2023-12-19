interface Entry {
    type: string; // 'number', 'operator'
    value: string;
}

interface Operation {
    name: string;
    arity: number; // >= 1
    op: Function;
}

export class CalcModel {
    history: Array<Entry>;
    inError: boolean;
    ops: Map<string, Operation>;

    constructor() {
        this.clear();
        this.ops = new Map<string, Operation>();
        this.pushOp({name: '+', arity: 2, op: (a: number, b: number): number => a + b});
        this.pushOp({name: '-', arity: 2, op: (a: number, b: number): number => a - b});
        this.pushOp({name: '*', arity: 2, op: (a: number, b: number): number => a * b});
        this.pushOp({name: '/', arity: 2, op: (a: number, b: number): number => b != 0 ? a / b : 0});
        this.pushOp({name: '^', arity: 2, op: (a: number, b: number): number => Math.pow(a, b)});
    }

    pushOp(op: Operation): boolean  {
        if (this.ops.has(op.name)) {// duplicate op
            return false;
        }
        this.ops.set(op.name, op);
        return true;
    }

    pushEntry(entry: Entry): void {
        if (entry.type != 'number' && entry.type != 'operator') { // invalid type
            return;
        } else if (entry.type == 'operator' && !this.ops.get(entry.value)) { // unknown operator
            return;
        } else if (entry.type == 'operator' && !this.topEntry()) { // no operand
            return;
        }
        this.history.push(entry);
    }

    evaluate(): number {
        const entry     = this.history.pop();
        let   theResult = 0;
        if (entry && entry.type == 'number') { // arity = 2
            const right   = parseFloat(entry.value);
            const opEntry = this.history.pop();
            if (!opEntry || opEntry.type != 'operator') {
                this.error();
                return theResult;
            }
            const leftEntry = this.history.pop();
            if (!leftEntry || leftEntry.type != 'number') {
                this.error();
                return theResult;
            }
            const left = parseFloat(leftEntry.value);
            const op   = this.ops.get(opEntry.value);
            if (!op || op.arity != 2) {
                this.error();
                return theResult;
            }
            theResult = op.op(left, right);
            this.pushEntry({type: 'number', value: theResult.toString()});
            return theResult;
        } else if (entry && entry.type == 'operator') { // arity = 1
            const op = this.ops.get(entry.value);
            if (!op || op.arity != 1) {
                this.error();
                return theResult;
            }
            const numEntry = this.history.pop();
            if (!numEntry || numEntry.type != 'number') {
                this.error();
                return theResult;
            }
            const num = parseFloat(numEntry.value);
            theResult = op.op(num);
            this.pushEntry({type: 'number', value: theResult.toString()});
            return theResult;
        }
        this.error();
        return theResult;
    }

    topEntry(): Entry {
        return this.history[this.history.length-1];
    }

    clear(): void {
        this.history = [];
        this.inError = false;
    }

    error(): void {
        this.clear();
        this.inError = true;
    }

    hasError(): boolean {
        return this.inError;
    }
}