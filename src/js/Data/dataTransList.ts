export const dataTransList = {
  groupList: ['Группа 1', 'Группа 2', 'Группа 3'],
  currentGroup: 'Группа2',
  balance: '+100',
  currency: '$',
  transactions : [
    {
      description: 'Поезд Минск-Гродно',
      day: '12-10-2020',
      time: '15:20',
      cost: '-5',
      currency: '$',
      submit: false,
      users: [
        {name : 'Коля',
         avatar: 'ooooo',
        }
      ]
    },
    {
      description: 'Поезд Гродно-Варшава',
      day: '12-10-2020',
      time: '15:20',
      cost: '-5',
      currency: '$',
      submit: false,
      users: [
        {name : 'Коля',
         avatar: 'ooooo',
        }
      ]
    },
    {
      description: 'Самолет Минск-Москва',
      day: '12-10-2020',
      time: '15:20',
      cost: '+300',
      currency: '$',
      users: [
        {name : 'Коля',
         avatar: 'ooooo',
         cost: '-5',
         currency: '$',
         submit: true,
         comment: 'Комментарий',
        },
        {name : 'Оля',
         avatar: 'ooooo',
         cost: '-5',
         currency: '$',
         submit: true,
         comment: 'Комментарий',
        },
        {name : 'Петя',
         avatar: 'ooooo',
         cost: '-5',
         currency: '$',
         submit: false,
         comment: 'Комментарий',
        },
        {name : 'Маша',
        avatar: 'ooooo',
        cost: '-5',
        currency: '$',
        submit: false,
        comment: 'Комментарий',
       },
       {name : 'Саша',
        avatar: 'ooooo',
        cost: '-5',
        currency: '$',
        submit: true,
        comment: 'Комментарий',
       },
      ]
    }
  ],
};