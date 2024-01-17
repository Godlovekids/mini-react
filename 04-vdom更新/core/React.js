const createElement = (type, props, ...children) => {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = typeof child === 'string' || typeof child === 'number'
        return isTextNode ? createTextNode(child) : child
      })
    }

  }
}
const createTextNode = (text) => {
  return {
    type: 'TEXT_NODE',
    props: {
      nodeValue: text,
      children: []
    },
  }
}

const createDom = (type) => {
  return type === 'TEXT_NODE' ? document.createTextNode('') : document.createElement(type)
}

const updateProps = (dom, props) => {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      if(key.startsWith('on')) {
        let eventType = key.toLowerCase().slice(2)
        dom.addEventListener(eventType, props[key])
      } else {
        dom[key] = props[key]
      }
    }
  })
}

const initChildren = (fiber, children) => {
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }


    prevChild = newFiber
  })
}

const render = (el, container) => {

  nextWorkUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
  root = nextWorkUnit

}

let root = null
let nextWorkUnit = null
function workLoop(IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performanceWorkUnit(nextWorkUnit)
    shouldYield = IdleDeadline.timeRemaining() < 1
  }
  if (!nextWorkUnit && root) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function commitRoot() {
  commitWork(root.child)
  root = null
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom)
  }
  if (fiber.child) commitWork(fiber.child)
  if (fiber.sibling) commitWork(fiber.sibling)
}

function updateFunctionComponent (fiber) {
  let children = [fiber.type(fiber.props)]

  initChildren(fiber, children)
}
function updateOriginComponent (fiber) {
  if(!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type)
    updateProps(dom, fiber.props)
  }
  let children = fiber.props.children

  initChildren(fiber, children)
}

function performanceWorkUnit(fiber) {
  let isFunctionComponent = typeof fiber.type === 'function'

  if(isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateOriginComponent(fiber)
  }

  
  if (fiber.child) {
    return fiber.child
  }   

  let nextFiber = fiber
  while (nextFiber) {
    if(nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }

  
}


requestIdleCallback(workLoop)





const React = {
  render,
  createElement
}
export default React
