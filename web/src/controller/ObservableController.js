export default class ObservableController {
  constructor(){
    this.observers = new Set();
  }

  subscribe(callback){
    this.observers.add(callback);
    return () => {
      this.observers.delete(callback);
    };
  }

  notify(state){
    this.observers.forEach((observer) => {
      observer(state)
    })
  }

}
