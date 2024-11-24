import {Operation} from "./Operations.ts";

export class Move {
    readonly left: number
    readonly right: number
    readonly op: Operation

    constructor(left: number, op: Operation, right: number) {
        this.left = left
        this.op = op
        this.right = right
    }

    toString(): string {
        return this.op.toString(this.left, this.right)
    }
}