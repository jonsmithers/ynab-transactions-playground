import { Account as AccountData } from 'ynab';

export class Account {
  constructor(readonly account: AccountData) {}

  get name() {
    return this.account.name;
  }

  get id() {
    return this.account.id;
  }

  get type() {
    return this.account.type;
  }

  get balance() {
    return this.account.balance;
  }
}
