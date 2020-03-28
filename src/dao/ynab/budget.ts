import {API} from 'ynab';

import {Budget} from '../../beans/budget';
import {BudgetDAO} from '../interface/budget';

export class YnabBudgetDAO implements BudgetDAO {
  constructor(private readonly ynabAPI: API) {}

  getAll(): Promise<Budget[]> {
    return this.ynabAPI.budgets.getBudgets().then(budgetsResponse => {
      return budgetsResponse.data.budgets.map(b => new Budget(b));
    });
  }

  getById(id: string): Promise<Budget> {
    return this.ynabAPI.budgets.getBudgetById(id).then(
        budgetResponse => new Budget(budgetResponse.data.budget));
  }

  save(): Promise<void> {
    return Promise.reject('Save not supported');
  }

  update(): Promise<void> {
    return Promise.reject('Update not supported');
  }

  delete(): Promise<void> {
    return Promise.reject('Delete not supported');
  }
}
