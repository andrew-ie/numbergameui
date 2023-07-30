import random from "random";
import {Graph} from "./GameGraph";

export class Level {
    readonly graph: Graph
    readonly target: number
    constructor(seed: number = Date.now(),
                size: number = 6,
                startIntMin: number = 1,
                startIntMax: number = 35,
                destinationIntMin: number = 100,
                destinationIntMax: number = 300) {
        const startTime = Date.now()
        const rng = random.clone(seed)
        const startPoints: number[] = []
        while (startPoints.length < size) {
            const nextNum= rng.int(startIntMin, startIntMax)
            if (startPoints.indexOf(nextNum) < 0) {
                startPoints.push(nextNum)
            }
        }
        this.graph = new Graph(startPoints)
        const allPossibleDestinations = this.graph.getPossibleDestinations()
        const idealDestinations = allPossibleDestinations.filter((candidate) =>
            candidate >= destinationIntMin && candidate <= destinationIntMax)
        if (idealDestinations.length !== 0) {
            this.target = idealDestinations[rng.int(0, idealDestinations.length)]
        } else {
            allPossibleDestinations.sort()
            const secondaryTargetIndex = allPossibleDestinations.findIndex((candidate) => candidate > destinationIntMin)
            if (secondaryTargetIndex >= 0) {
                this.target = idealDestinations[secondaryTargetIndex]
            } else {
                allPossibleDestinations.reverse()
                const finalIndex = allPossibleDestinations.findIndex((candidate) => candidate < destinationIntMax)
                this.target = idealDestinations[finalIndex]
            }
        }
        const finishTime = Date.now()
        console.log(`level generation time (${seed}) took ${finishTime - startTime}ms`)
    }
}
