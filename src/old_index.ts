import {API} from 'ynab';

// import {Account} from './account';
import {Budget} from './beans/budget';
import {CategoryGroup} from './beans/category';
import {YnabBudgetDAO} from './dao/ynab/budget';
import {YnabTransactionsDAO} from './dao/ynab/transactions';
import {Exporter, mergeCategoriesCrossBudgets} from './export';

// import {Exporter} from './export';
// import {Transaction} from './transaction';

const accessToken = process.argv[2];

const ynabAPI = new API(accessToken);
const budgetService = new YnabBudgetDAO(ynabAPI);
const transactionsService = new YnabTransactionsDAO(ynabAPI);

const exporter = new Exporter(budgetService, transactionsService, ynabAPI);

const ids = exporter.getAllBudgets()
                .then((budgets: Budget[]) => {
                  const billy = budgets.filter(b => b.name === 'Billy')[0];
                  const marissa = budgets.filter(b => b.name === 'Marissa')[0];
                  // const combined = budgets.filter(b => b.name ===
                  // 'Experiment')[0];

                  // const family = new Family([billy, marissa], combined);
                  return [billy, marissa];
                })
                .then(budgets => budgets.map(b => b.id));

ids.catch(console.log);

/*
ids.then((ids: string[]) => {
     return exporter.getAllTransactions(ids);
   })
    .then((transactions: Transaction[]) => {
      console.log(transactions.map(t => t.toAspire()).join('\n'));
    });

const accounts: Promise<Account[]> = ids.then((ids: string[]) => {
return exporter.getAllAccounts(ids);
});

accounts.then(accts => {
  console.table(accts.map(a => a.name).join('\n'));
});
 */

const categories: Promise<CategoryGroup[][]> = ids.then((ids: string[]) => {
  return exporter.getAllCategoryGroups(ids);
});

ids.then((ids) => {
     return exporter.getAllCategoryTransfersByMonth(ids, '2020-01-02')
         .then(r => r.flat());
   })
    .then(categories => {
      console.log(
          `${categories.map(c => `${c.name},${c.budgeted}`).join('\n')}`);
    })
    .catch(console.log);


categories
    .then((budgets) => {
      const groups = mergeCategoriesCrossBudgets(budgets);
      groups;
      // console.log(groups.map(g => g.toAspire()).join('\n'));
    })
    .catch(console.log);
