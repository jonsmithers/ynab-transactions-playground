import {TransactionDetail} from 'ynab';

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
}
