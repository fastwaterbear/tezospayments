import { LocalPaymentService } from '../services/localPaymentService';

export const app = {
  localPaymentService: new LocalPaymentService()
} as const;
