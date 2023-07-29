export interface Operation {
    canApply(operandA: number, operandB: number): boolean
    apply(operandA: number, operandB: number): number
    symbol: string
}

const Add: Operation = {
    apply(operandA: number, operandB: number): number {
        return operandA + operandB
    },
    canApply(): boolean {
        return true;
    },
    symbol: '+'
}
const Subtract: Operation = {
    canApply(operandA: number, operandB: number): boolean {
        return operandA > operandB;
    },
    apply(operandA: number, operandB: number): number {
        return operandA - operandB;
    },
    symbol: '-'
}
const Multiply: Operation = {
    apply(operandA: number, operandB: number): number {
        return operandA * operandB;
    },
    canApply(): boolean {
        return true
    },
    symbol: 'x'
}
const Divide: Operation = {
    canApply(operandA: number, operandB: number): boolean {
        return operandA % operandB === 0;
    },
    apply(operandA: number, operandB: number): number {
        return operandA / operandB;
    },
    symbol: '/'
}

export const Operations = {
    Add: Add,
    Subtract: Subtract,
    Multiply: Multiply,
    Divide: Divide
}
