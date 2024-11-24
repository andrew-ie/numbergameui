import {Operation, Operations} from "./Operations";
import {Move} from "./Move.ts";

export class Graph {
    readonly startNode: RootEdge
    private readonly traceStarts: Map<number, readonly Edge[]>
    constructor(startPoint: number[]) {
        this.startNode = new RootEdge(startPoint);
        let allEdges = destinations(this.startNode)
        let nextLevel = allEdges
        while (nextLevel.length > 0) {
            nextLevel = nextLevel.flatMap(function(edge) {
                return destinations(edge)
            })
            allEdges = allEdges.concat(nextLevel)
        }
        const traces = new Map<number, Edge[]>()
        allEdges.forEach(function(edge) {
            edge.destination.forEach(function(entry) {
                if (traces.has(entry)) {
                    (traces.get(entry) as Edge[]).push(edge)
                } else {
                    traces.set(entry, [edge])
                }
            })

        })
        this.traceStarts = traces
    }

    getPossibleDestinations(): number[] {
        return Array.from(this.traceStarts.keys()).filter((value) => {
            return this.startNode.destination.indexOf(value) === -1
        })
    }

    solutions(value: number): TransitionEdge[] {
        if (this.traceStarts.has(value)) {
            return (this.traceStarts.get(value) as TransitionEdge[])
        } else {
            return []
        }
    }
}

export interface Edge {
    readonly source: Edge | null
    readonly destination: readonly number[]
}
export class RootEdge implements Edge {
    readonly source: null = null
    readonly destination: readonly number[]

    constructor(startPoint: number[]) {
        this.destination = startPoint
    }
}

export class TransitionEdge implements Edge {
    readonly source: Edge
    readonly destination: readonly number[]
    readonly operator: Operation
    readonly leftIndex: number
    readonly rightIndex: number
    constructor(source: Edge, destination: number[], operator: Operation, leftIndex: number, rightIndex: number) {
        this.source = source
        this.destination = destination
        this.operator = operator
        this.leftIndex = leftIndex
        this.rightIndex = rightIndex
    }

    toMoves(): Move[] {
        const moves: Move[] = []
        moves.unshift(new Move(this.source.destination[this.leftIndex], this.operator, this.source.destination[this.rightIndex]))
        let nextEdge = this.source
        while (nextEdge instanceof TransitionEdge) {
            moves.unshift(new Move(nextEdge.source.destination[nextEdge.leftIndex], nextEdge.operator, nextEdge.source.destination[nextEdge.rightIndex]))
            nextEdge = nextEdge.source
        }
        return moves
    }
}

function destinations(source: Edge): Edge[] {
    if (source.destination.length < 2) {
        return []
    } else {
        const result: Edge[] = []
        source.destination.forEach(function (leftValue, leftIndex) {
            const remainder = source.destination.slice(leftIndex + 1, source.destination.length)
            remainder.forEach(function (rightValue, rightIndexPrefix) {
                const rightIndex = leftIndex + rightIndexPrefix + 1
                const remainingDigits = source.destination.filter(function(_, index) {
                    return index !== leftIndex && index !== rightIndex
                })
                let op: keyof typeof Operations

                for (op in Operations) {
                    if (Operations[op].canApply(leftValue, rightValue)) {
                        const newValue = Operations[op].apply(leftValue, rightValue)
                        const newNode = Object.assign([], remainingDigits)
                        newNode.push(newValue)
                        newNode.sort().reverse()
                        const edge = new TransitionEdge(source, newNode, Operations[op], leftIndex, rightIndex)
                        result.push(edge)
                    }
                }
            })
        })
        return result
    }
}
export {}