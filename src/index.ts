import {API} from 'ynab';
import {Budget} from './budget';
import {Transaction} from './transaction';

const accessToken = process.argv[2];

const ynabAPI = new API(accessToken);

ynabAPI.budgets.getBudgets()
    .then(budgetsResponse => {
      const budgets = budgetsResponse.data.budgets.map(b => new Budget(b));

      const billy = budgets.filter(b => b.name === 'Billy')[0];
      const marissa = budgets.filter(b => b.name === 'Marissa')[0];
      // const combined = budgets.filter(b => b.name === 'Experiment')[0];

      // const family = new Family([billy, marissa], combined);

      return Promise.all([
        ynabAPI.transactions.getTransactions(billy.id),
        ynabAPI.transactions.getTransactions(marissa.id)
      ]);
    })
    .then(transactionsResp => {
      const transactions = transactionsResp.flatMap(ts => ts.data.transactions)
                               .map((trans) => new Transaction(trans));
      console.log(transactions.reduce(
          (acc: number, t) => acc + t.transaction.amount / 1000, 0));
      // console.log(Transaction.getHeader());
      // console.log(transactions.map(t => t.toCSV()).join('\n'));
    });
