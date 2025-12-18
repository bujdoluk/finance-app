import fs from 'fs';
import csv from 'csv-parser';
import { TransactionsInput } from '../../../database/dbSchema';

export function importTransactionsFromCSV(filePath: string): Promise<TransactionsInput[]> {
    return new Promise((res, rej) => {
        const results: TransactionsInput[] = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                results.push({
                    date: new Date(row.date),
                    amount: row.amount,
                    category: row.category,
                    sender: row.sender,
                    id: row.id,
                    sender_picture: row.sender_picture ?? null,
                })
            })
            .on('end', () => res(results))
            .on('error', rej);
    });
} ;