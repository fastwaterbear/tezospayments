import { LocalPaymentService } from '../services/localPaymentService';
import { AppStore } from '../store';

export class App {
  readonly store: AppStore;
  readonly localPaymentService: LocalPaymentService;

  constructor(storeFactory: (app: App) => AppStore) {
    this.store = storeFactory(this);

    this.localPaymentService = new LocalPaymentService(this.store);
  }
}
