export interface IGroupData {
  title: string;
  description: string;
  dateCreate: number;
  dateClose: number | null;
  userList: string[] | [];
  transactionList: string[] | [];
  style: any;
}
