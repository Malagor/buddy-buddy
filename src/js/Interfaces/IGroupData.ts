export interface IGroupData {
  title: string;
  description: string;
  dateCreate: number;
  dateClose: number | null;
  transactionList: string[] | [];
  icon: string;
}
