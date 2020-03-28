import {SaveTransaction, TransactionDetail} from 'ynab';

export class Transaction {
  constructor(readonly transaction: TransactionDetail) {}

  static getTestHeader(): string {
    return `
      deleted,
      cleared,
      approved,
      date,
      amount,
      category_name,
      account_name,
      payee_name,
      memo,
    `;
  }

  toTestCSV(): string {
    return `
      ${this.transaction.deleted},
      ${this.transaction.cleared},
      ${this.transaction.approved},
      ${this.transaction.date},
      ${this.transaction.amount / 1000},
      ${this.transaction.account_name},
      ${this.transaction.category_name},
      ${this.transaction.payee_name},
      ${this.transaction.memo},
    `;
  }

  static getHeader(): string {
    return 'deleted,cleared,approved,date,amount,category_name,account_name,payee_name,memo';
  }

  toCSV(): string {
    return `${this.transaction.deleted},${this.transaction.cleared},${
        this.transaction.approved},${this.transaction.date},${
        this.transaction.amount / 1000},${this.transaction.category_name},${
        this.transaction.account_name},${this.transaction.payee_name},${
        this.transaction.memo}`;
  }

  get id(): string {
    return this.transaction.id;
  }

  get inflow(): number {
    return Math.abs(Math.max(0, this.transaction.amount));
  };

  get outflow(): number {
    return Math.abs(Math.min(0, this.transaction.amount));
  };

  get category_name(): string {
    if (this.transaction.category_name === 'Immediate Income SubCategory') {
      return 'Available to budget';
    }
    return this.transaction.category_name ?? '';
  }

  toAspire(): string {
    return `${this.transaction.date},${this.inflow / 1000},${
        this.outflow /
        1000},${this.category_name},${this.transaction.account_name},${
        this.transaction.memo},${this.transaction.cleared},${
        this.transaction.approved},${this.transaction.payee_name}`;
  }

  toSaveObject(): SaveTransaction {
    return {
      account_id: this.transaction.account_id,
      date: this.transaction.date,
      amount: this.transaction.amount,
      payee_id: this.transaction.payee_id,
      payee_name: this.transaction.payee_name,
      category_id: this.transaction.category_id,
      memo: this.transaction.memo,
      cleared: this.transaction.cleared,
      approved: this.transaction.approved,
      flag_color: this.transaction.flag_color,
      import_id: this.transaction.import_id,
      subtransactions: this.transaction.subtransactions,
    };
  }
}
