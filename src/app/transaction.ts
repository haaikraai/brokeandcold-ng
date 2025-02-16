export interface Transaction {
    date: number | string | Date,
    tags: Array<string>,
    amount: number,
}
 export interface OmniscientTransaction extends Transaction {
    id: number
 }