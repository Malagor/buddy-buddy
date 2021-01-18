export interface IGroupData {
  title: string;
  description: string;
  dateCreate: number;
  dateClose: number | null;
  transactionList: string[] | [];
  icon: string;
}

export interface IGroupDataAll {
  groupData: IGroupData;
  userList: string[];
  currentGroup: boolean;
}

export interface IDataForCreateGroup {
  groupData: IGroupData;
  userList: string[];
  currentGroup: boolean;
  userId: string;
}
