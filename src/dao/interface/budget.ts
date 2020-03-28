import {Budget} from '../../beans/budget';

export interface BudgetDAO {
  getAll(): Promise<Budget[]>;
  getById(id: string): Promise<Budget>;
  save(budget: Budget): Promise<void>;
  update(budget: Budget): Promise<void>;
  delete(id: string): Promise<void>;
}
