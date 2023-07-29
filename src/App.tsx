import React, {useState} from 'react';
import './App.css';
import {Operation, Operations} from "./Operations";
import {TransitionEdge} from "./GameGraph";
import {Level} from "./Level";
import {Game} from "./Game";

function App() {
  const [game, setGame] = useState(() => new Game(new Level()))
  const [selected, setSelect] = useState(-1)
  const [selectedOperation, setOperation] = useState(null as Operation | null)
  const [, updateState] = React.useState({})
  const forceUpdate = React.useCallback(() => updateState({}), [])

  function createSelect(index: number) {
    return function () {
      if (selected === index) {
        setSelect(-1)
        setOperation(null)
      } else if (selectedOperation !== null) {
        if (game?.move(selected, selectedOperation, index)) {
          setSelect(-1)
          setOperation(null)
          setGame(game)
        }
      } else {
        setSelect(index)
      }
    }
  }

  function createSelectOperation(op: Operation) {
    return function () {
      if (op !== selectedOperation) {
        setOperation(op)
      } else {
        setOperation(null)
      }
    }
  }

  function isActiveOperation(operation: Operation, selectedIndex: Operation | null, basicClass: string) {
    if (operation === selectedIndex) {
      return basicClass + " active"
    } else {
      return basicClass
    }
  }

  function isActive(index: number, selectedIndex: number, basicClass: string) {
    if (index === selectedIndex) {
      return basicClass + " active"
    } else {
      return basicClass
    }
  }

  function iterate(edge: TransitionEdge): TransitionEdge[] {
    const result = [edge]
    while (result[result.length - 1].source !== null && result[result.length - 1].source.source !== null) {
      result.push(result[result.length - 1].source as TransitionEdge)
    }
    return result.reverse()
  }

  function newGame() {
    setGame(new Game(new Level()))
    setSelect(-1)
    setOperation(null)
    return false
  }

  function undo() {
    const canundo = game.undo()
    if (canundo) {
      forceUpdate()
    }
  }

  return (
      <div id="main-content">
        <div id="solved-model" hidden={!game.solved()}>
          Congratulations!
        </div>
        <div id="game">
          <div id="game-prompt-text">Use any combination of numbers to reach the target:</div>
          <div id="target-wrapper">
            <div id="target">{game.target}</div>
          </div>
          <div id="numbers">
            {game.currentActiveSet.map((number, index) => {
              if (number > 0) {
                return <div key={"number-pos-" + index} className={isActive(index, selected, "number")}
                            id={"number-pos-" + index} onClick={createSelect(index)}>
                  {number}
                </div>
              } else {
                return null
              }
            }).filter(content => content != null)}
          </div>
          <div id="operations">
            <div id="undo" onClick={() => undo()}>&#x21a9;</div>
            <div className={isActiveOperation(Operations.Add, selectedOperation, "operation")} id="add"
                    onClick={createSelectOperation(Operations.Add)}>{Operations.Add.symbol}</div>
            <div className={isActiveOperation(Operations.Subtract, selectedOperation, "operation")} id="subtract"
                    onClick={createSelectOperation(Operations.Subtract)}>{Operations.Subtract.symbol}
            </div>
            <div className={isActiveOperation(Operations.Multiply, selectedOperation, "operation")} id="multiply"
                    onClick={createSelectOperation(Operations.Multiply)}>{Operations.Multiply.symbol}
            </div>
            <div className={isActiveOperation(Operations.Divide, selectedOperation, "operation")} id="divide"
                    onClick={createSelectOperation(Operations.Divide)}>{Operations.Divide.symbol}
            </div>
          </div>
          <div id="solution" hidden={true}>
            {iterate(game.solution).map((edge, index) => {
              return <div
                  key={"solution-line-" + index}>{edge.source.destination[edge.leftIndex]} {edge.operator.symbol} {edge.source.destination[edge.rightIndex]}</div>
            })}
          </div>
          <div id="startnewgame">
            <button onClick={newGame}>New Game</button>
          </div>
        </div>
      </div>
  );
}

export default App;
