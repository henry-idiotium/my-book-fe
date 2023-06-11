import { ChatEntryProps } from '@/pages/messages/chat-entry/chat-entry';
import { MessageEntity, MinimalUserEntity } from '@/types';

export const mock = {
  getMainUser: (): MinimalUserEntity => ({
    id: 1,
    alias: 'main.user@real.mail.com',
    firstName: 'Johnny',
    lastName: 'McDonald',
  }),
  getConvoMembers: (_convoId: number | string): MinimalUserEntity[] => [
    mock.getMainUser(),
    {
      id: 2,
      alias: 'not.main.user.2@real.mail.com',
      firstName: 'Lizzie',
      lastName: 'Rose',
    },
    {
      id: 3,
      alias: 'not.main.user.3@real.mail.com',
      firstName: 'Lena',
      lastName: 'Boone',
    },
    {
      id: 4,
      alias: 'not.main.user.4@real.mail.com',
      firstName: 'Henry',
      lastName: 'Powell',
    },
    {
      id: 5,
      alias: 'not.main.user.5@real.mail.com',
      firstName: 'Iva',
      lastName: 'Love',
    },
  ],
  getConvos: (_convoId: number | string) => {
    const messages: MessageEntity[] = [
      {
        id: '68f1fc63-3151-5ac0-8aed-7fe8c709ef20',
        at: new Date('2023-06-07T07:25:05'),
        content:
          'Voluptatem vel consequatur facere rerum quidem et consequatur et ea.',
        from: 1,
        isEdited: false,
      },
      {
        id: '0a8b6954-6688-5122-8c02-76bedde45198',
        at: new Date('2023-06-07T07:39:39'),
        content:
          'Aperiam nemo rerum omnis qui suscipit recusandae dolorem illo.',
        from: 2,
        isEdited: false,
      },
      {
        id: 'a7cb1bed-2db5-5a8e-bea7-d50439d65400',
        at: new Date('2023-06-07T15:19:23'),
        content: 'Voluptatibus animi distinctio sunt et ut non fuga dolores.',
        from: 3,
        isEdited: false,
      },
      {
        id: '26d1daad-620b-573d-bca3-33634d36736f',
        at: new Date('2023-16-08T05:36:40'),
        content: 'Aut eos voluptas et voluptas.',
        from: 1,
        isEdited: false,
      },
      {
        id: '7fb6008d-f610-5d1e-b858-c61a1199d797',
        at: new Date('2023-06-08T06:58:13'),
        content: 'Ullam facilis aut temporibus provident.',
        from: 1,
        isEdited: true,
      },
      {
        id: '7fb6008d-f610-5d1e-b858-c61a1199d797',
        at: new Date('2023-06-08T07:27:42'),
        content:
          'Recusandae consequuntur aspernatur et asperiores et aut et laboriosam omnis.',
        from: 2,
        isEdited: false,
      },
    ];

    const convos: ChatEntryProps['entry'][] = [
      {
        id: 'bf698a60-7540-58b9-a11a-3fdd1049fbd6',
        name: 'et nesciunt et',
        conversationBetween: [1, 4],
        messages,
      },
      {
        id: '56600a6b-6101-5aa9-ba4b-a49f268a664d',
        name: 'commodi quia exercitationem',
        admin: 1,
        members: [3, 1, 4],
        messages,
      },
      {
        id: 'a01df260-27c9-5b36-a94a-44e08a9a18f0',
        name: 'voluptas corporis est',
        admin: 2,
        members: [1, 2, 3],
        messages,
      },
      {
        id: '4f39520a-d0b6-59d3-8f62-c4aacf2d5c87',
        name: 'sint sed natus',
        conversationBetween: [1, 5],
        messages,
      },
      {
        id: '4601b229-7cea-5d33-9ed9-55a3b9c975f4',
        name: 'aut debitis nam',
        admin: 4,
        members: [1, 3, 4],
        messages,
      },
    ];

    return convos;
  },
};
