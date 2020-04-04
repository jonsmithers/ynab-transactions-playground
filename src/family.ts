import { API } from 'ynab';

import { Budget } from './budget';

export class FamilyService {
  constructor(
    readonly ynabAPI: API,
    readonly members: Budget[],
    readonly combinedBudget: Budget
  ) {}

  getCombinedAccounts() {
    return this.ynabAPI.accounts
      .getAccounts(this.combinedBudget.id)
      .then(r => r.data.accounts);
  }

  getMemberAccounts() {
    const allAccounts = this.members.map(m =>
      this.ynabAPI.accounts.getAccounts(m.id).then(r => r.data.accounts)
    );
    return (
      Promise.all(allAccounts)
        // flat()
        .then(r => r.reduce((acc, val) => acc.concat(val), []))
    );
  }
}
