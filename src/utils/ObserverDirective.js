import { AsyncDirective } from 'lit/async-directive.js';
import { noChange } from 'lit';

export default class ObserverDirective extends AsyncDirective{
  render(observable){
    if(this.observable !== observable){
      this.unsubscribe?.();
      this.observable = observable;
      if (this.isConnected) {
        this.subscribe(observable)
      }
    }
    return noChange
  }

  subscribe(observable) {
    this.unsubscribe = observable.subscribe((value) => {
      setTimeout(() => {
        this.callback(typeof value === 'function' ? value() : value)
      })
    })
  }

  disconnected() {
    super.disconnected();
    this.unsubscribe?.()
  }

  reconnected() {
    super.reconnected();
    if(this.observable){
      this.subscribe(this.observable)
    }
  }
}
