import React, {useState} from 'react';
import './App.css';
import {Operation, Operations} from "./Operations";
import {TransitionEdge} from "./GameGraph";
import {Level} from "./Level";

function App() {
  const [level, setLevel] = useState(() => new Level())
  const solution = level.graph.solutions(level.target)
  const [numbers, setNumbers]  = useState(() => level.graph.startNode.map((input) => input))
  const [selected, setSelect] = useState(-1)
  const [selectedOperation, setOperation] = useState(null as Operation | null)
  const [previous, setPrevious] = useState(new Array<number[]>())

  function createSelect(index:number) {
    return function(){
      if (selected === index) {
        setSelect(-1)
      } else if (selectedOperation !== null) {
        if (selectedOperation.canApply(numbers[selected], numbers[index])) {
          const currentNumbers: number[] = Object.assign([], numbers)
          previous.push(currentNumbers)
          setPrevious(previous)
          numbers[index] = selectedOperation.apply(numbers[selected], numbers[index])
          numbers[selected] = 0;
          setSelect(-1)
          setOperation(null)
          setNumbers(numbers)
        }
      } else {
        setSelect(index)
      }
    }
  }

  function undo() {
    if (previous.length > 0) {
      let lastState = (previous.pop() as number[])
      setNumbers(lastState)
    }
  }

  function createSelectOperation(index:Operation) {
    return function() {
      if (selected >= 0) {
        setOperation(index)
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
    setLevel(new Level())
    return false
  }

  return (
      <div id="main-content">
        <div id="game">
          <div id="game-prompt-text">Use any combination of numbers to reach the target: </div>
          <div id="target-wrapper">
            <div id="target">{level.target}</div>
          </div>
          <div id="numbers">
            {numbers.map((number, index) => {
              if (number > 0) {
                return <div key={"number-pos-" + index} className={isActive(index, selected, "number")} id={"number-pos-" + index} onClick={createSelect(index)}>
                  {number}
                </div>
              } else {
                return null
              }
            }).filter(content => content != null)}
          </div>
          <div id="operations">
            <button id="undo" onClick={undo}><span className="icon-undo" /></button>
            <button className={isActiveOperation(Operations.Add, selectedOperation, "operation")} id="add" onClick={createSelectOperation(Operations.Add)}><span className="icon-add" /></button>
            <button className={isActiveOperation(Operations.Subtract, selectedOperation, "operation")} id="subtract" onClick={createSelectOperation(Operations.Subtract)}><span className="icon-subtract" /></button>
            <button className={isActiveOperation(Operations.Multiply, selectedOperation, "operation")} id="multiply" onClick={createSelectOperation(Operations.Multiply)}><span className="icon-multiply" /></button>
            <button className={isActiveOperation(Operations.Divide, selectedOperation, "operation")} id="divide" onClick={createSelectOperation(Operations.Divide)}><span className="icon-divide" /></button>
          </div>
          <div id="solution">
            {iterate(solution[0]).map((edge, index) => {
                  return <div key={"solution-line-" + index}>{edge.source.destination[edge.leftIndex]} {edge.operator.symbol} {edge.source.destination[edge.rightIndex]}</div>
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
