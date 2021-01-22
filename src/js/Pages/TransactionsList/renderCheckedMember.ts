export const renderCheckedMember = (user: any, currUser: any[]) => {
  return `
  <div class="details__member d-flex flex-column align-items-center">
    <div class="details__avatar"><img src="${user.avatar}" alt=${user.name}></div>
    <div class="details__name">${user.name}</div>
  </div>
  <input class="details__member-cost form-control form-control-sm ${currUser[1].costFix}" type="text" value=${(+currUser[1].cost).toFixed(2)}>
  <textarea class="details__member-comment form-control" placeholder="Комментарий">${currUser[1].comment}</textarea>
  <div class="details__member-state d-flex justify-content-center"></div>
  <button class="details__member-delete btn btn-outline-secondary btn-sm"><i class="material-icons">clear</i></button>
`;
}