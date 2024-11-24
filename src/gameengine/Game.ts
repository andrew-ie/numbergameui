import {Edge, Graph, TransitionEdge} from "./GameGraph";
import {Operation} from "./Operations";
import {Move} from "./Move.ts";

export class Game {
    readonly graph: Graph
    readonly target: number
    readonly solution: TransitionEdge
    private currentActiveSet: Edge

    constructor(graph: Graph, target: number, maxDistance: number = 0) {
        this.graph = graph
        this.target = target
        let optimalSolution: TransitionEdge | undefined = undefined
        let distance = 0
        while (!optimalSolution && distance <= maxDistance) {
            const currSolutions = graph.solutions(this.target + distance)
            if (currSolutions) {
                optimalSolution = currSolutions[0]
            } else if (distance > 0) {
                const alternateDir = graph.solutions(this.target - distance)
                if (alternateDir) {
                    optimalSolution = alternateDir[0]
                }
            }
            distance++
        }
        if (!optimalSolution) {
            throw Error(`Unable to find solution for ${target} in ${graph.startNode}`)
        }
        this.solution = optimalSolution
        this.currentActiveSet = this.graph.startNode
    }

    solved():boolean {
        return this.currentActiveSet.destination.indexOf(this.target) !== -1
    }

    move(leftIndex: number, op: Operation, rightIndex: number): boolean {
        const numbers = this.currentActiveSet.destination
        const validMove = leftIndex < numbers.length && rightIndex < numbers.length && op.canApply(numbers[leftIndex], numbers[rightIndex])
        if (validMove) {
            const newNumbers = numbers.filter((_, index) => index !== leftIndex && index !== rightIndex).concat(op.apply(numbers[leftIndex], numbers[rightIndex]))
            this.currentActiveSet = new TransitionEdge(
                this.currentActiveSet,
                newNumbers,
                op,
                leftIndex,
                rightIndex
            )
        }
        console.log(`${numbers} - ${validMove}`)
        return validMove
    }

    /**
     * Get all of the previous moves made
     */
    getMoves(): Move[] {
        const moves: Move[] = []
        let currPosition = this.currentActiveSet
        while (currPosition instanceof TransitionEdge) {
            moves.unshift(new Move(currPosition.source.destination[currPosition.leftIndex], currPosition.operator, currPosition.source.destination[currPosition.rightIndex]))
            currPosition = currPosition.source
        }
        return moves
    }

    numbers(): readonly number[] {
        return this.currentActiveSet.destination
    }

    undo(index: number): boolean {
        const edges: Edge[] = []
        let currPosition: Edge | null = this.currentActiveSet
        while (currPosition !== null) {
            edges.unshift(currPosition)
            currPosition = currPosition.source
        }
        if (index > edges.length) {
            return false
        }
        this.currentActiveSet = edges[index]
        return true
    }

}
