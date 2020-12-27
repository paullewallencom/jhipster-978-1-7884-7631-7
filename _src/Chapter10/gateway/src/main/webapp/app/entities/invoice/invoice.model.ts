import { BaseEntity } from './../../shared';

export const enum InvoiceStatus {
    'PAID',
    'ISSUED',
    'CANCELLED'
}

export const enum PaymentMethod {
    'CREDIT_CARD',
    'CASH_ON_DELIVERY',
    'PAYPAL'
}

export class Invoice implements BaseEntity {
    constructor(
        public id?: number,
        public date?: any,
        public details?: string,
        public status?: InvoiceStatus,
        public paymentMethod?: PaymentMethod,
        public paymentDate?: any,
        public paymentAmount?: number,
        public shipments?: BaseEntity[],
    ) {
    }
}
