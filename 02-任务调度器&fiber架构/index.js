

let taskId = 1
function workLoop (IdleDeadline) {
  taskId++
  let shouldYield = false
  while(!shouldYield) {
    console.log(`taskId:${taskId}`)
    shouldYield = IdleDeadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)
}


requestIdleCallback(workLoop)

