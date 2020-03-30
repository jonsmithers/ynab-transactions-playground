import {sheets_v4} from 'googleapis';

import {Transaction} from '../../beans/transaction';
import {TransactionsDAO} from '../interface/transactions';
import {SheetRangeBuilder} from './interfaces';


export class SheetsTransactionsDAO implements TransactionsDAO {
  constructor(
      readonly sheetsService: sheets_v4.Sheets,
      readonly sheetRangeBuilder: SheetRangeBuilder) {
    this.sheetRangeBuilder.withSheetPrefix('Transactions');
  }

  getAllInBudget(b_id: string): Promise<Transaction[]> {
    return this.sheetsService.spreadsheets.values
        .get(this.sheetRangeBuilder.withSheet(b_id).build())
        .then((val) => {
          return val.data.values!.map(
              (row) => Transaction.fromSheetsArray(row));
        });
  }

  getById(): Promise<Transaction> {
    throw new Error('Not implemented, try using cached service.');
  }

  save(b_id: string, transaction: Transaction): Promise<Transaction> {
    return this.saveAll(b_id, [transaction]).then((ts) => ts[0]);
  }

  update(): Promise<Transaction> {
    throw new Error('Not implemented');
  }

  delete(): Promise<Transaction> {
    throw new Error('Not implemented');
  }

  saveAll(b_id: string, transactions: Transaction[]): Promise<Transaction[]> {
    return this.sheetsService.spreadsheets.values
        .append({
          ...this.sheetRangeBuilder.withSheet(b_id).build(),
          valueInputOption: 'USER_ENTERED',
          requestBody: {values: transactions.map(t => t.toSheetsArray(b_id))}
        })
        .then(() => transactions);
  }
}
