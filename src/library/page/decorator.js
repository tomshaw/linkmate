export default class Decorator {
  constructor(component, info) {
    return component.process(info)
  }
}
