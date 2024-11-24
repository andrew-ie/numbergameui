import {Game} from "./Game.ts";
import {Level, StandardNumberProvider} from "./Level.ts";
import {Operation} from "./Operations.ts";
import {Graph} from "./GameGraph.ts";

/**
 * Immutable data class containing game state
 */
export class GameState {
    readonly game: Game
    readonly currentLevel: number
    readonly currentHighestSolved: number
    readonly currentLeft: number | undefined
    readonly currentRight: number | undefined
    readonly currentSelectedOperation: Operation | undefined
    readonly storage: Storage

    constructor(storage: Storage, currentLeft?: number | undefined, currentRight?: number | undefined, currentSelectedOperation?: Operation | undefined, game?: Game) {
        this.storage = storage
        this.currentLevel = parseInt(storage.getItem("levelNumber") || "1")
        this.currentHighestSolved = parseInt(storage.getItem("highestSolved") || "0")
        this.currentLeft = currentLeft
        this.currentRight = currentRight
        this.currentSelectedOperation = currentSelectedOperation
        if (game) {
            this.game = game
        } else {
            const level = new Level(this.currentLevel, new StandardNumberProvider())
            this.game = new Game(level.graph, level.target)
        }
    }

    updateLevel(newLevel: number): GameState {
        this.storage.setItem("levelNumber", "" + newLevel)
        return new GameState(
            this.storage,
            undefined,
            undefined,
            undefined
        )
    }

    toggle(index: number) {
        let newLeft: number | undefined
        let newRight: number | undefined
        if (this.currentLeft === index) {
            newLeft = undefined
            newRight = this.currentRight
        } else if (this.currentRight === index) {
            newLeft = this.currentLeft
            newRight = undefined
        } else if (this.currentLeft === undefined) {
            newLeft = index
            newRight = this.currentRight
        } else if (this.currentRight === undefined) {
            newLeft = this.currentLeft
            newRight = index
        } else {
            newLeft = index
            newRight = undefined
        }
        return new GameState(this.storage, newLeft, newRight, this.currentSelectedOperation, this.game)
    }

    updateOperation(operation?: Operation) {
        return new GameState(
            this.storage,
            this.currentLeft,
            this.currentRight,
            operation,
            this.game
        )
    }

    revert(index: number) {
        this.game.undo(index)
        return new GameState(
            this.storage,
            undefined,
            undefined,
            undefined,
            this.game
        )
    }

    move() {
        if (this.currentLeft !== undefined && this.currentSelectedOperation !== undefined && this.currentRight !== undefined && this.game.move(this.currentLeft, this.currentSelectedOperation, this.currentRight)) {
            return new GameState(
                this.storage,
                undefined,
                undefined,
                undefined,
                this.game
            )
        } else {
            throw new Error("Can't transition here")
        }
    }
    nextGame(storage: Storage, toLast: boolean = false): GameState {
        if (this.game.solved() && this.currentLevel > this.currentHighestSolved) {
            storage.setItem("highestSolved", "" + this.currentLevel)
        }
        if (this.game.solved() || this.currentLevel <= this.currentHighestSolved) {
            if (toLast) {
                storage.setItem("levelNumber", "" + (this.currentHighestSolved + 1))
            } else {
                storage.setItem("levelNumber", "" + (this.currentLevel + 1))
            }
        }
        return buildGame(storage)
    }
}

export function buildGame(storage: Storage): GameState {
    return new GameState(storage)
}

export function solveGame(target: number, startPoint: number[]): Game {
    const graph = new Graph(startPoint)
    return new Game(graph, target)
}