import {BudgetSummary} from 'ynab';

export class Budget {
  constructor(readonly budget: BudgetSummary) {}

  get name() {
    return this.budget.name;
  }

  get id() {
    return this.budget.id;
  }
}
