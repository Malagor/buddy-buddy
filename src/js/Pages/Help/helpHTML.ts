import { i18n } from '@lingui/core';

export const helpHTML = () => {
  return `
  <section class="section help__menu">
    <div class="d-flex align-items-start">
      <div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
        <a class="nav-link active help-nav-link" id="v-pills-home-tab" data-bs-toggle="pill" href="#v-pills-home" role="tab"
          aria-controls="v-pills-home" aria-selected="true">${i18n._('mainPage')}</a>

        <a class="nav-link help-nav-link" id="v-pills-account-tab" data-bs-toggle="pill" href="#v-pills-account" role="tab"
          aria-controls="v-pills-account" aria-selected="false">${i18n._('accountPage')}</a>

        <a class="nav-link help-nav-link" id="v-pills-contacts-tab" data-bs-toggle="pill" href="#v-pills-contacts" role="tab"
          aria-controls="v-pills-contacts" aria-selected="false">${i18n._('contactsPage')}</a>

        <a class="nav-link help-nav-link" id="v-pills-groups-tab" data-bs-toggle="pill" href="#v-pills-groups" role="tab"
          aria-controls="v-pills-groups" aria-selected="false">${i18n._('groupsPage')}</a>

        <a class="nav-link help-nav-link" id="v-pills-transactions-tab" data-bs-toggle="pill" href="#v-pills-transactions" role="tab"
          aria-controls="v-pills-transactions" aria-selected="false">${i18n._('transactionsPage')}</a>

        <a class="nav-link help-nav-link" id="v-pills-messages-tab" data-bs-toggle="pill" href="#v-pills-messages" role="tab"
          aria-controls="v-pills-messages" aria-selected="false">${i18n._('messagesPage')}</a>

      </div>
      <div class="tab-content" id="v-pills-tabContent">
        <div class="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
          <h2>${i18n._('mainPage')}</h2>
          <p>${i18n._('On this page you can view:')}</p>
          <ul>
            <li>${i18n._('total balance in your current currency;')}</li>
            <li>${i18n._('table of major currencies with the ability to view the total balance in these currencies;')}</li>
            <li>${i18n._('groups with your')} <strong>${i18n._('participation')}</strong>;</li>
            <li>${i18n._('list of last/recent transactions.')}</li>
          </ul>
        </div>
        <div class="tab-pane fade" id="v-pills-account" role="tabpanel" aria-labelledby="v-pills-account-tab">
          <h2>${i18n._('accountPage')}</h2>
          <p>${i18n._('On this page you can view or/and modify your personal data.')}</p>
          <h3>${i18n._('How can I modify the data?')}</h3>
          <p>${i18n._('You should enter new data into inputs (user name, user id), choose another value in selects (currency, theme, language), upload a new avatar photo by clicking on the needed button.')}</p>
          <h3>${i18n._('How can I save new data?')}</h3>
          <p>${i18n._('You should click on the "Save" button.')}</p>
          <p><strong>${i18n._('Attention!')}</strong> ${i18n._('New avatar photo will be saved only after saving data.')}</p>
          <h3>${i18n._('How can I recover the data?')}</h3>
          <p>${i18n._('You can recover changed and unsaved data by leaving the page. However, if the data has been saved, you cannot recover the data.')}</p>
        </div>
        <div class="tab-pane fade" id="v-pills-contacts" role="tabpanel" aria-labelledby="v-pills-contacts-tab">
          <h2>${i18n._('contactsPage')}</h2>
          <p>${i18n._('On this page, you can view your contacts list and you can add another user to your contacts.')}</p>
          <h3>${i18n._('How can I add another user to my contacts?')}</h3>
          <p>${i18n._('You should enter in searching inputs')} <strong>${i18n._('full username')}</strong> ${i18n._('or')} <strong>${i18n._('user account id')}</strong>.
          </p>
          <p>${i18n._('If both fields are filled in, the app will issue a warning. If a user is found, he/she will be added to the contacts list and he/she will receive a notification about this event. This user can approve or decline invitation. If he/she declines invitation, this user will not be available for adding to groups and writing messages.')}</p>
          <p>${i18n._('From the above, the conclusion is that you can only interact with users from your contact list - first we add to the list, then add to groups or communicate.')}</p>
          <h3>${i18n._('I have received a notification. What should I do?')}</h3>
          <p>${i18n._('When another user adds you to his/her contacts, you receive a notification in the form of a marker in the menu.')}</p>
          <p>${i18n._('When you go to the contact page, you will see cards with borders -')} <strong>${i18n._('"pending"')}</strong> ${i18n._('invitations. These contacts have a state selection field:')}</p>
          <ul>
            <li>${i18n._('"approve')}</li>
            <li>${i18n._('"pending')}</li>
          </ul>
          <p>${i18n._('By selecting')} <strong>${i18n._('approve"')}</strong> ${i18n._('you confirm the exchange of contacts, there will be no marks on this contact the next time you visit this page.')}</p>
          <p>${i18n._('By selecting')} <strong>${i18n._('pending"')}</strong> ${i18n._('you leave the current state of the contact.')}</p>
          <h3>${i18n._('Removing a contact')}</h3>
          <p>${i18n._('Contacts are removed mutually. By removing a contact from your contact list, you also exclude yourself from another user’s contacts.')}</p>
          <p>${i18n._('To remove a contact click on the cross in the upper right corner of the contact card. The app will ask for confirmation. If you confirm removal of the contact, the process will be irreversibly launched.')}</p>
          <p>${i18n._('But, you can re-invite users to your contact list, they will receive a notification about this and all will go according to the above scheme.')}</p>
        </div>
        <div class="tab-pane fade" id="v-pills-groups" role="tabpanel" aria-labelledby="v-pills-groups-tab">
          <h2>${i18n._('groupsPage')}</h2>
          <p>${i18n._('This page displays a list of all user groups, on this page you can also create or edit a group.')}</p>
          <p>${i18n._('Private groups are located in the bottom drop-down window.')}</p>
          <h3>${i18n._('Group creation')}</h3>
          <p>${i18n._('There is a button for creating a new group at the bottom of the page, when you click on this button, a window opens to fill in the data.')}</p>
          <p>${i18n._('Group title is the required field.')}</p>
          <h3>${i18n._('To view a detailed description of the group, you need to click on the group.')}</h3>
          <p>${i18n._('The group displays the logo, name, description, total group balance, members and their balances in the group, graph.')}</p>
          <p>${i18n._('The creator of the group has exclusive rights: he/she can delete and add users, as well as close the group.')}</p>
          <ul>
            <li>${i18n._('You can delete a user if he/she closed all transactions and his/her balance is 0.')}</li>
            <li>${i18n._('You can add a user at any time: just enter his/her unique account id in the corresponding field in the @name format or select a user from the suggested list;')}</li>
            <li>${i18n._('You can close a group after all users of the group have closed transactions and the group balance is 0.')}</li>
          </ul>
          <h3>${i18n._('Group invitation')}</h3>
          <p>${i18n._('The group to which you were invited is highlighted in green. To accept or reject the invitation, the user must go to the group details and, opposite his/her avatar, accept or reject the invitation:')}</p>
          <ul>
            <li>${i18n._('"Prove";')}</li>
            <li>${i18n._('"Disprove".')}</li>
          </ul>
        </div>
        <div class="tab-pane fade" id="v-pills-transactions" role="tabpanel" aria-labelledby="v-pills-transactions-tab">
          <h2>${i18n._('transactionsPage')}</h2>
          <p>${i18n._('On this page, you can see a list of all your transactions and create a new transaction.')}</p>
          <h3>${i18n._('How can I view transaction details?')}</h3>
          <p>${i18n._('When you select the desired group, a list of all transactions (incoming and outgoing) made in this group, as well as the user balance in this group, is displayed.')}</p>
          <p><strong>${i18n._('In green')}</strong> ${i18n._('are marked the transactions that require confirmation or rejection. For confirmation or rejection, you must select the appropriate item in the transaction card.')}</p>
          <p><strong>${i18n._('In yellow')}</strong> ${i18n._('are marked the transactions created by you, which are awaiting confirmation from all participants.')}</p>
          <p><strong>${i18n._('In red')}</strong> ${i18n._('are marked the transactions:')}</p>
          <ul>
            <li>${i18n._('if it is an outgoing (created by you) transaction, then it is rejected by one of the users;')}</li>
            <li>${i18n._('if it is an incoming (created by another group member) transaction, then it is rejected by you and is waiting for you to be removed from the list of transaction participants.')}</li>
          </ul>
          <p>${i18n._('You can also view detailed information about the transaction, including the receipt photo, balance and comment for each participant by clicking on the card of the corresponding transaction.')}</p>
          <p>${i18n._('If the transaction is incoming, then in the modal window with detailed information, you can also accept or reject the transaction by selecting the required field in the list.')}.</p>
          <h3>${i18n._('How can I create a new transaction?')}</h3>
          <p>${i18n._('A new transaction can be created by clicking on the "New Transaction" button at the bottom of the page.')}</p>
          <p>${i18n._('In the modal window that appears, select a group, specify a description of the transaction and the total balance. If necessary, add a photo of the receipt. Further, by clicking on a group member, you can add it to the transaction or remove it. The total balance will be automatically distributed among all participants in the transaction in equal shares. If the participant is entered a specific amount, then the total balance, minus this one, will again be recalculated in equal shares for the rest of the participants in the transaction.')}</p>
          <p>${i18n._('In the field')} <strong>${i18n._('"Comment"')}</strong> ${i18n._('you can leave a comment for each participant in the transaction.')}</p>
          <p>${i18n._('After checking all the entered data, click on “Create transaction” button. The new transaction will automatically appear in the list of transactions of the corresponding group.')}</p>
          <h3>${i18n._('How can I edit a transaction?')}</h3>
          <p>${i18n._('Only transactions created by you can be edited.')}</p>
          <p>${i18n._('In the modal window with detailed information (see above), you can add participants to the transaction, as well as delete them by clicking on the "+" or "-" icon opposite the participant. After adding or removing participants, the total balance will be redistributed again among the participants.')}</p>
          <p>${i18n._('To delete a transaction, you must click on the "Delete" button at the bottom of the modal window.')}</p>
          <p>${i18n._('After all the changes, click Save. All changes, including the common balance, will be displayed in the app.')}</p>
        </div>
        <div class="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
          <h2>${i18n._('messagesPage')}</h2>
          <p>${i18n._('The app allows to exchange messages with')} <strong>${i18n._('your contacts')}</strong>.</p>
          <p>${i18n._('Incoming messages are located on the left side of the page. Outgoing on the right. Your incoming messages are also highlighted.')}</p>
          <p>${i18n._('When you receive a new message you will see a notification as a menu marker. When you go to the message page, the notification marker disappears. New messages are marked with a green border.')}</p>
          <h3>${i18n._('How can I write a message?')}</h3>
          <p>${i18n._('To write a new message, use the button at the bottom of the page. When you click on the button, a window will appear where you can select a recipient and write him/her a message.')}</p>
          <p>${i18n._('The recipient can be selected from the list (the list is compiled from your contacts) or by starting to enter a username or user account id and the list will be filtered. You need to select the desired contact so that it appears in the "input field".')}</p>
          <p>${i18n._('When you sent some message, your recipient will receive a notification in the form of a marker in the menu.')}</p>
          <h3>${i18n._('Reply to message')}</h3>
          <p>${i18n._('For a quick reply to a message, you can press the corresponding "Answer" button in the message, the recipient will be added in the corresponding field automatically. All that remains is to write a message and send.')}</p>
        </div>
      </div>
    </div>
  </section>`;
};

