export const setCardStyles = (trans: any, owner: boolean, ownUID: string) => {

  let btnDisplay: string;
  let cost: string;
  let colorCost: string;

  if (owner) {
    btnDisplay = 'd-none';
    cost = `-${(+trans.totalCost).toFixed(2)}`;
    colorCost = 'text-danger';
  } else {
    btnDisplay = 'd-flex';
    const user: any[] = Object.entries(trans.toUserList).find((user: any) => user[0] === ownUID);
    cost = `+${(+user[1].cost).toFixed(2)}`;
    colorCost = 'text-success';
  }

  let selectPending: string = '';
  let selectAbort: string = '';
  let selectApprove: string = '';
  let border: string = '';
  if (!owner) {
    Object.entries(trans.toUserList).forEach((user: any) => {
      if (user[0] === ownUID) {
        if (user[1].state === 'pending') {
          selectPending = 'selected';
          border = 'border-success';
        } else if (user[1].state === 'decline') {
          selectAbort = 'selected';
          border = 'border-danger';
        } else if (user[1].state === 'approve') {
          selectApprove = 'selected';
          btnDisplay = 'd-none';
        }
      }
    });
  } else if (Object.entries(trans.toUserList).some((user: any) => user[1].state === 'decline')) {
    border = 'border-danger';
  } else if (Object.entries(trans.toUserList).some((user: any) => user[1].state === 'pending')) {
    border = 'border-warning';
  }

  return {
    btnDisplay,
    cost,
    colorCost,
    border,
    selectPending,
    selectAbort,
    selectApprove
  };
};
