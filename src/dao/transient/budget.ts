import { BudgetSummary } from 'ynab';

import { Budget } from '../../beans/budget';
import { fromNullable } from '../../util/option';
import { BudgetDAO } from '../interface/budget';

export class TransientBudgetDAO implements BudgetDAO {
  readonly budgets: Map<string, Budget>;

  constructor(budgets: Map<string, BudgetSummary>) {
    this.budgets = new Map(
      Array.from(budgets.entries()).map(val => {
        return [val[0], new Budget(val[1])];
      })
    );
  }

  getAll(): Promise<Budget[]> {
    return Promise.resolve(
      Array.from(this.budgets.values()).map(v => new Budget(v.budget))
    );
  }

  getById(id: string): Promise<Budget> {
    return Promise.resolve()
      .then(() => fromNullable(this.budgets.get(id)))
      .then(b => b.unwrap());
  }

  save(budget: Budget): Promise<void> {
    if (this.budgets.has(budget.id)) {
      return Promise.reject('Budget already exists');
    }
    this.budgets.set(budget.id, budget);
    return Promise.resolve();
  }

  update(budget: Budget): Promise<void> {
    if (!this.budgets.has(budget.id)) {
      return Promise.reject('Budget does not already exist');
    }
    this.budgets.set(budget.id, budget);
    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    if (!this.budgets.has(id)) {
      return Promise.reject('Budget does not exist');
    }
    this.budgets.delete(id);
    return Promise.resolve();
  }
}
