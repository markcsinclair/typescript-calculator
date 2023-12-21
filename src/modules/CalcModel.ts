export interface Entry {
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
        this.pushOp({name: '-/+', arity: 1, op: (a: number): number => -a});
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
        const entry = this.history.pop();
        if (entry && entry.type == 'number') { // arity = 2
            const right   = parseFloat(entry.value);
            const opEntry = this.history.pop();
            if (!opEntry || opEntry.type != 'operator') {
                this.error();
                return 0;
            }
            const leftEntry = this.history.pop();
            if (!leftEntry || leftEntry.type != 'number') {
                this.error();
                return 0;
            }
            const left = parseFloat(leftEntry.value);
            const op   = this.ops.get(opEntry.value);
            if (!op || op.arity != 2) {
                this.error();
                return 0;
            }
            return op.op(left, right);
        } else if (entry && entry.type == 'operator') { // arity = 1
            const op = this.ops.get(entry.value);
            if (!op || op.arity != 1) {
                this.error();
                return 0;
            }
            const numEntry = this.history.pop();
            if (!numEntry || numEntry.type != 'number') {
                this.error();
                return 0;
            }
            const num = parseFloat(numEntry.value);
            return op.op(num);
        }
        this.error();
        return 0;
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

    arity(opName: string): number {
        const op = this.ops.get(opName);
        return !op ? 0 : op.arity;
    }

    binaryOpReady(): boolean {
        const top = this.topEntry();
        return (top && top.type == 'operator' && this.arity(top.value) == 2) ? true : false;
    }
}