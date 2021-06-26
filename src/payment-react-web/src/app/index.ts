import { LocalPaymentService } from '../services';

export const app = {
  localPaymentService: new LocalPaymentService()
} as const;
