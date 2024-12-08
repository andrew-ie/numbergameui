export interface Operation {
    canApply(operandA: number, operandB: number): boolean
    apply(operandA: number, operandB: number): number
    symbol: string
    toString(operandA: number, operandB: number): string
}

const Add: Operation = {
    apply(operandA: number, operandB: number): number {
        return operandA + operandB
    },
    canApply(): boolean {
        return true;
    },
    symbol: '+', toString(operandA: number, operandB: number): string {
        return `${operandA} ${this.symbol} ${operandB} = ${this.apply(operandA, operandB)}`;
    }

}
const Subtract: Operation = {
    canApply(operandA: number, operandB: number): boolean {
        return operandA != operandB;
    },
    apply(operandA: number, operandB: number): number {
        if (operandA > operandB) {
            return operandA - operandB
        } else {
            return operandB - operandA
        }
    },
    symbol: '-',
    toString(operandA: number, operandB: number): string {
        if (operandA > operandB) {
            return `${operandA} ${this.symbol} ${operandB} = ${this.apply(operandA, operandB)}`;
        } else {
            return `${operandB} ${this.symbol} ${operandA} = ${this.apply(operandB, operandA)}`;
        }
    }

}
const Multiply: Operation = {
    apply(operandA: number, operandB: number): number {
        return operandA * operandB;
    },
    canApply(): boolean {
        return true
    },
    symbol: '×', toString(operandA: number, operandB: number): string {
        return `${operandA} ${this.symbol} ${operandB} = ${this.apply(operandA, operandB)}`;
    }
}
const Divide: Operation = {
    canApply(operandA: number, operandB: number): boolean {
        return (operandA % operandB === 0) || (operandB % operandA === 0);
    },
    apply(operandA: number, operandB: number): number {
        if (operandA % operandB === 0) {
            return operandA / operandB
        } else {
            return operandB / operandA
        }
    },
    symbol: '÷', toString(operandA: number, operandB: number): string {
        if (operandA % operandB === 0) {
            return `${operandA} ${this.symbol} ${operandB} = ${this.apply(operandA, operandB)}`;
        } else {
            return `${operandB} ${this.symbol} ${operandA} = ${this.apply(operandB, operandA)}`;
        }
    }

}

export const Operations = {
    Add: Add,
    Subtract: Subtract,
    Multiply: Multiply,
    Divide: Divide
}
