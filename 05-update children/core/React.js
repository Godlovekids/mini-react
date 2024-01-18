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

const updateProps = (dom, nextProps, prevProps) => {
  // 1. old 有 new 沒有 刪除
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key)
      }
    }
  })
  // 2. new 有 old 沒有 添加
  // 3. new 有 old 有 修改
  Object.keys(nextProps).forEach(key => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          let eventType = key.toLowerCase().slice(2)
          dom.removeEventListener(eventType, prevProps[key])
          dom.addEventListener(eventType, nextProps[key])
        } else {
          dom[key] = nextProps[key]
        }
      }
    }
  })
}

const reconcileChildren = (fiber, children) => {
  let oldFiber = fiber.alternate?.child
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type
    let newFiber = null
    if (isSameType) {
      // 更新
      newFiber = {
        type: child.type,
        props: child.props,
        child: null,
        parent: fiber,
        sibling: null,
        dom: oldFiber.dom,
        effectTag: 'UPDATE',
        alternate: oldFiber
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          child: null,
          parent: fiber,
          sibling: null,
          dom: null,
          effectTag: 'PLACEMENT'
        }
      }

      if (oldFiber) {
        deletions.push(oldFiber)
      }
    }



    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    if (newFiber) {
      prevChild = newFiber
    }
  })

  while (oldFiber) {
    deletions.push(oldFiber)
    oldFiber = oldFiber.sibling
  }
}

const render = (el, container) => {

  wipRoot = {
    dom: container,
    props: {
      children: [el]
    }
  }
  nextWorkUnit = wipRoot

}

let wipRoot = null
let currentRoot = null
let nextWorkUnit = null
let deletions = []
let wipFiber = null
function workLoop(IdleDeadline) {
  let shouldYield = false
  while (!shouldYield && nextWorkUnit) {
    nextWorkUnit = performanceWorkUnit(nextWorkUnit)

    if(wipRoot?.sibling?.type === nextWorkUnit?.type) {
      nextWorkUnit = undefined
    }

    shouldYield = IdleDeadline.timeRemaining() < 1
  }
  if (!nextWorkUnit && wipRoot) {
    commitRoot()
  }
  requestIdleCallback(workLoop)
}

function commitRoot() {
  deletions.forEach(commitDeletion)
  commitWork(wipRoot.child)
  currentRoot = wipRoot
  wipRoot = null
  deletions = []
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent
    }
    fiberParent.dom.removeChild(fiber.dom)
  } else {
    commitDeletion(fiber.child)
  }
}

function commitWork(fiber) {
  if (!fiber) return
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.effectTag === 'PLACEMENT') {
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom)
    }
  } else if (fiber.effectTag === 'UPDATE') {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
  }
  if (fiber.child) commitWork(fiber.child)
  if (fiber.sibling) commitWork(fiber.sibling)
}

function updateFunctionComponent(fiber) {

  wipFiber = fiber
  let children = [fiber.type(fiber.props)]

  reconcileChildren(fiber, children)
}
function updateOriginComponent(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type)
    updateProps(dom, fiber.props, {})
  }
  let children = fiber.props.children

  reconcileChildren(fiber, children)
}

function performanceWorkUnit(fiber) {
  let isFunctionComponent = typeof fiber.type === 'function'

  if (isFunctionComponent) {
    updateFunctionComponent(fiber)
  } else {
    updateOriginComponent(fiber)
  }


  if (fiber.child) {
    return fiber.child
  }

  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling
    nextFiber = nextFiber.parent
  }


}


requestIdleCallback(workLoop)

const update = () => {
  let currentFiber = wipFiber
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextWorkUnit = wipRoot
  }

}



const React = {
  update,
  render,
  createElement
}
export default React
