import {Operations, Operation} from "./Operations";


export class Graph {
    readonly startNode: readonly number[]
    private readonly traceStarts: Map<number, readonly Edge[]>
    constructor(startPoint: number[]) {

        let allEdges = destinations(new RootEdge(startPoint))
        let nextLevel = allEdges
        while (nextLevel.length > 0) {
            nextLevel = nextLevel.flatMap(function(edge) {
                return destinations(edge)
            })
            allEdges = allEdges.concat(nextLevel)
        }
        this.startNode = startPoint
        const traces = new Map<number, Edge[]>()
        allEdges.forEach(function(edge) {
            edge.destination.forEach(function(entry) {
                if (traces.has(entry)) {
                    traces.get(entry)!!.push(edge)
                } else {
                    traces.set(entry, [edge])
                }
            })

        })
        this.traceStarts = traces
    }

    getPossibleDestinations(): number[] {
        return Array.from(this.traceStarts.keys()).filter((value) => {
            return this.startNode.indexOf(value) === -1
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
    source: Edge | null
    destination: number[]
}
export class RootEdge implements Edge {
    source: null = null
    destination: number[]

    constructor(startPoint: number[]) {
        this.destination = startPoint
    }
}

export class TransitionEdge implements Edge {
    source: Edge
    destination: number[]
    operator: Operation
    leftIndex: number
    rightIndex: number
    constructor(source: Edge, destination: number[], operator: Operation, leftIndex: number, rightIndex: number) {
        this.source = source
        this.destination = destination
        this.operator = operator
        this.leftIndex = leftIndex
        this.rightIndex = rightIndex
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

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
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