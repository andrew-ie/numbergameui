import {Graph, TransitionEdge} from "./GameGraph";
import {Operation} from "./Operations";
import {Level} from "./Level";

export class Game {
    graph: Graph
    target: number
    solution: TransitionEdge
    currentActiveSet: number[]
    previousSet: number[][]

    constructor(level: Level) {
        this.graph = level.graph
        this.target = level.target
        this.solution = level.graph.solutions(this.target)[0]
        this.currentActiveSet = this.graph.startNode.map((number) => number)
        this.previousSet = []
        console.log("Game ready")
    }

    solved():boolean {
        return this.currentActiveSet.indexOf(this.target) !== -1
    }

    move(leftIndex: number, op: Operation, rightIndex: number): boolean {
        const validMove = leftIndex < this.currentActiveSet.length && rightIndex < this.currentActiveSet.length && op.canApply(this.currentActiveSet[leftIndex], this.currentActiveSet[rightIndex])
        if (validMove) {
            const previousState = this.currentActiveSet.map((number) => number)
            this.previousSet.push(previousState)
            this.currentActiveSet[rightIndex] = op.apply(this.currentActiveSet[leftIndex], this.currentActiveSet[rightIndex])
            this.currentActiveSet[leftIndex] = 0
        }
        return validMove
    }

    undo(): boolean {
        if (this.previousSet.length > 0) {
            Object.assign(this.currentActiveSet, this.previousSet.pop() as number[])
            return true
        } else {
            return false
        }
    }
}
