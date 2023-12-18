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
    ops: Map<string, Operation>;

    constructor() {
        this.history = [];
        this.ops = new Map<string, Operation>();
        this.pushOp({name: '+', arity: 2, op: (a: number, b: number): number => a + b});
        this.pushOp({name: '-', arity: 2, op: (a: number, b: number): number => a - b});
        this.pushOp({name: '*', arity: 2, op: (a: number, b: number): number => a * b});
        this.pushOp({name: '/', arity: 2, op: (a: number, b: number): number => a / b});
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
        }
        this.history.push(entry);
    }

    evaluate(): number {
        const entry = this.history.pop();
        if (entry && entry.type == 'number') { // arity = 2
            const right   = parseFloat(entry.value);
            const opEntry = this.history.pop();
            if (!opEntry || opEntry.type != 'operation') {
                return 0;
            }
            const leftEntry = this.history.pop();
            if (!leftEntry || leftEntry.type != 'number') {
                return 0;
            }
            const left = parseFloat(leftEntry.value);
            const op   = this.ops.get(opEntry.value);
            if (!op || op.arity != 2) {
                return 0;
            }
            const theResult = op.op(left, right);
            this.pushEntry({type: 'number', value: theResult.toString()});
            return theResult;
        } else if (entry && entry.type == 'operation') { // arity = 1
            const op = this.ops.get(entry.value);
            if (!op || op.arity != 1) {
                return 0;
            }
            const numEntry = this.history.pop();
            if (!numEntry || numEntry.type != 'number') {
                return 0;
            }
            const num       = parseFloat(numEntry.value);
            const theResult = op.op(num);
            this.pushEntry({type: 'number', value: theResult.toString()});
            return theResult;
        } 
        return 0;
    }
}