import React from "./core/React.js"

function Foo() {
  let [count, setCount] = React.useState(1);
  let [bar, setBar] = React.useState(1);
  function handleClick() {
    setCount(c => c+1)
    setBar(c => c+1)
    setBar('322222')
  }
  return (<div><h1>foo</h1>{count}<br></br>{bar}<button onClick={handleClick}>click</button></div>)
}


function App() {
  return <div id="app">hi-mini <Foo></Foo></div>
}
export default App
