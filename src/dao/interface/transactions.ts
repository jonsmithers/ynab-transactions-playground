import {Transaction} from '../../beans/transaction';

export interface TransactionsDAO {
  getAllInBudget(b_id: string): Promise<Transaction[]>;
  getById(b_id: string, t_id: string): Promise<Transaction>;
  save(b_id: string, transaction: Transaction): Promise<Transaction>;
  update(b_id: string, transaction: Transaction): Promise<Transaction>;
}
