export const setDetailsStyles = (trans: any, owner: boolean, ownUID: string) => {
  const userList: any[] = Object.entries(trans.toUserList);
  let ownComment: string = '';
  let ownCost: string = '';
  userList.forEach ((user) => {
    if (user[0] === ownUID) {
      ownComment = user[1].comment;
      ownCost = (+user[1].cost).toFixed(2);
    }
  });

  let ownerDisplay: string;
  let colorText: string;
  let cost: string;
  let membDisplay: string;
  let commentDisplay: string;
  let selectDisplay: string;
  if (owner) {
    ownerDisplay = 'd-none';

    colorText = 'text-danger';
    cost = `-${trans.totalCost.toFixed(2)}`;
    membDisplay = '';
    commentDisplay = 'd-none';
    selectDisplay = 'd-none';

  } else {
    ownerDisplay = '';
    colorText = 'text-success';
    cost = `+${ownCost}`;
    membDisplay = 'd-none';
    commentDisplay = '';
    selectDisplay = '';

    if (ownComment === '') {
      commentDisplay = 'd-none';
    }
  }

  let btnSaveDisplay: string = '';
  if (!owner) {
    btnSaveDisplay = 'd-none';
  }

  let checkDisplay: string;
  if (trans.photo) {
    checkDisplay = 'd-flex';
  } else {
    checkDisplay = 'd-none';
  }

  return {
    ownComment,
    commentDisplay,
    ownerDisplay,
    colorText,
    cost,
    membDisplay,
    selectDisplay,
    btnSaveDisplay,
    checkDisplay
  };
};