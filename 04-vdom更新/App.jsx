import React from "./core/React.js"
function Counter ({num}) {
  return <div onClick={handleClick}>conuttttttttt{num}</div>
}
function handleClick () {
  console.log(123)
}
function CounterContanier () {
  return <Counter></Counter>
}
function App () {
  return <div id="app">hi-mini <Counter num={10}></Counter> </div>
}
export default App
