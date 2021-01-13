export const addMemberHTML = (ID: string, name: string, avatar: string) => {
  return `
  <div class="checked-member-wrapper d-flex align-items-center justify-content-between" user-id=${ID}>
    <div class="checked-member d-flex flex-column align-items-center">
      <div class="checked-member__avatar">${avatar}</div>
      <div class="checked-member__name">${name}</div>
    </div>
    <input class="checked-member__sum checked-member__sum--evenly form-control form-control-sm" type="text">
    <textarea class="checked-member__comment form-control" placeholder="Комментарий"></textarea>
  </div>
  `;
};