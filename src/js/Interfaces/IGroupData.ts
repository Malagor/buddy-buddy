export interface IGroupData {
  title: string;
  description: string;
  dateCreate: number;
  dateClose: number | null;
  transactionList: string[] | [];
  icon: File;
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

export interface IDataChangeStatus {
  userId: string;
  groupId: string;
  state: string;
}

export interface IDataAddMember {
  account: string;
  groupId: string;
}

export interface IDataCloseGroup {
  userList: string[];
  groupId: string;
}
