const createElement = (type, props, ...children) => {
  return {
    type,
    props:{
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
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
    if(key !== 'children') {
      dom[key] = props[key]
    }
  })
}

const initChildren = (fiber) => {
  let children = fiber.props.children
  let prevChild = null
  children.forEach((child,index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    if(index === 0) {
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
function workLoop (IdleDeadline) {
  let shouldYield = false
  while(!shouldYield && nextWorkUnit) {
    nextWorkUnit = performanceWorkUnit(nextWorkUnit)
    shouldYield = IdleDeadline.timeRemaining() < 1
  }
  if(!nextWorkUnit && root) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function commitRoot () {
  commitWork(root.child)
  root = null
}

function commitWork (fiber) {
  if(!fiber)return 
  fiber.parent.dom.append(fiber.dom)
  if(fiber.child) commitWork(fiber.child)
  if(fiber.sibling) commitWork(fiber.sibling)
}

function performanceWorkUnit(fiber) {
  if(!fiber.dom) {
    let dom = (fiber.dom = createDom(fiber.type)) 

    updateProps(dom, fiber.props)
  }
  initChildren(fiber)
  if(fiber.child) {
    return fiber.child
  } else if(fiber.sibling) {
    return fiber.sibling
  } else {
    return fiber.parent && fiber.parent.sibling
  }
}


requestIdleCallback(workLoop)





const React = {
  render,
  createElement
}
export default React
