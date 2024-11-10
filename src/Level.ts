import random, {Random} from "random";
import {Graph} from "./GameGraph";

export class Level {
    readonly graph: Graph
    readonly target: number
    constructor(seed: number = Date.now(),
                numberProvider: NumberProvider,
                size: number = 6,
                destinationIntMin: number = 100,
                destinationIntMax: number = 999
    ) {
        const startTime = Date.now()
        const rng = random.clone(seed)
        const startPoints: number[] = numberProvider.getNumbers(rng, size)
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

interface NumberProvider {
    getNumbers(rng: Random, size: number): number[]
}

/**
 * "Standard" number provider - similar to Countdown game
 * Generate 24 numbers, 2 each of 1-10, and the numbers 25,50,75,100
 * and then return 6 of them.
 */
export class StandardNumberProvider implements NumberProvider {
    private numbers: number[] = [
        25, 50, 75, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 , 9, 10
    ]

    getNumbers(rng: Random, size: number): number[] {
        let currentIndex = this.numbers.length
        while (currentIndex !== 0) {
            const randomIndex: number = rng.int(0, currentIndex - 1)
            if (randomIndex !== currentIndex) {
                const tmp = this.numbers[currentIndex]
                this.numbers[currentIndex] = this.numbers[randomIndex]
                this.numbers[randomIndex] = tmp
            }
            currentIndex--
        }
        return this.numbers.slice(0, size)
    }
}

/**
 * Harder number provider
 * Generate
 */
export class DifficultNumberProvider implements NumberProvider {
    private startIntMin: number
    private startIntMax: number

    constructor(
        startIntMin: number = 1,
        startIntMax: number = 35) {
        this.startIntMin = startIntMin
        this.startIntMax = startIntMax
    }

    getNumbers(rng: Random, size: number): number[] {
        const startPoints: number[] = []
        const nextNum = rng.int(this.startIntMin, this.startIntMax)
        while (startPoints.length < size) {
            if (startPoints.indexOf(nextNum) < 0) {
                startPoints.push(nextNum)
            }
        }
        return startPoints
    }
}