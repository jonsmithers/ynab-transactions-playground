import { API } from 'ynab';

import { Account } from './beans/account';
import { Budget } from './beans/budget';
import { Category, CategoryGroup } from './beans/category';
import { Transaction } from './beans/transaction';
import { BudgetDAO } from './dao/interface/budget';
import { TransactionsDAO } from './dao/interface/transactions';

export class Exporter {
  constructor(
    private readonly budget: BudgetDAO,
    private readonly transactions: TransactionsDAO,
    private readonly ynabAPI: API
  ) {}

  getAllBudgets(): Promise<Budget[]> {
    return this.budget.getAll();
  }

  getAllTransactions(budget_ids: string[]): Promise<Transaction[]> {
    return Promise.all(
      budget_ids.map(id => this.transactions.getAllInBudget(id))
    ).then(bs => bs.flat());
  }

  getAllAccounts(budgetIds: string[]): Promise<Account[]> {
    return Promise.all(
      budgetIds.map(id => this.ynabAPI.accounts.getAccounts(id))
    )
      .then(allAccountsForAllBudgetsResp =>
        allAccountsForAllBudgetsResp.flatMap(accts => accts.data.accounts)
      )
      .then(accnts => accnts.map(a => new Account(a)));
  }

  getAllCategoryGroups(ids: string[]): Promise<CategoryGroup[][]> {
    return Promise.all(
      ids.map(
        (id: string): Promise<CategoryGroup[]> => {
          return this.ynabAPI.categories
            .getCategories(id)
            .then((resp): CategoryGroup[] => {
              return resp.data.category_groups.map(
                group => new CategoryGroup(group)
              );
            });
        }
      )
    );
  }

  getAllCategoryTransfersByMonth(
    budget_ids: string[],
    month: string
  ): Promise<Category[][]> {
    return this.getAllCategoryGroups(budget_ids).then(
      (budgets: CategoryGroup[][]): Promise<Category[][]> => {
        return Promise.all(
          budgets.map(
            (groups, b_index): Promise<Category[]> => {
              return Promise.all(
                groups
                  .slice(0, 1)
                  .flatMap(g =>
                    g.categories
                      .slice(0, 1)
                      .map(c =>
                        this.getCategoryTransfersByMonth(
                          budget_ids[b_index],
                          month,
                          c.id
                        )
                      )
                  )
              );
            }
          )
        );
      }
    );
  }

  getCategoryTransfersByMonth(
    budget_id: string,
    month: string,
    category_id: string
  ): Promise<Category> {
    return this.ynabAPI.categories
      .getMonthCategoryById(budget_id, month, category_id)
      .then(res => new Category(res.data.category));
  }
}

export function mergeCategoriesCrossBudgets(
  budgets: CategoryGroup[][]
): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>();
  for (const b of budgets) {
    for (const group of b) {
      if (map.has(group.name)) {
        const existingGroup = map.get(group.name)!;
        for (const category of group.categories) {
          if (
            !existingGroup.categories.map(c => c.name).includes(category.name)
          ) {
            existingGroup.categories.push(category);
          }
        }
        map.set(group.name, existingGroup);
      } else {
        map.set(group.name, group);
      }
    }
  }
  return Array.from(map.values());
}
