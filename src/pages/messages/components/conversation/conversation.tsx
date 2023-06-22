import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useChatSocketConnection, useMessageActions } from '../../hooks';

import styles from './conversation.module.scss';

import UserImg from '@/assets/account-image.jpg';
import { useDispatch, useSelector } from '@/hooks';
import {
  chatSocketActions as actions,
  chatSocketMap,
  getOrConnectChatSocket,
  selectAuth,
  selectChatSocketById,
} from '@/stores';
import {
  chatSocketEvents as events,
  Conversation as ConvoUnionType,
  MinimalUserEntity,
  ChatSocketEntity,
} from '@/types';
import { Convo, User } from '@/utils';

// note: take a lock into "Wysiwyg Editor", for typing message
export function Conversation() {
  const dispatch = useDispatch();

  const { id = '' } = useParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { sendMessage, updateMessage, deleteMessage } = useMessageActions(id);

  const { user: mainUser, token } = useSelector(selectAuth);

  const { state: socketState, loading: socketLoading } =
    useChatSocketConnection(id);

  if (socketLoading) return <div>loading...</div>;

  const convo = extractUnionConvo(socketState);
  const titleName = extractTitleName(convo);
  const members = filterMembers(convo, mainUser.id);

  return (
    <div className={styles.container}>
      <div className={styles.topbar}>
        <div className={styles.topbarConvoImg}>
          <img src={UserImg} alt="conversation display" />
        </div>

        <div className={styles.topbarConvoTitle}>
          <span>{titleName}</span>
        </div>
        {/* action options */}
      </div>

      <div className={styles.content}>
        {/* content: the big one
        - RENDER startup if not past limit of 15 messages
        - but scroll up to the first message will prompt it to RENDER
      */}
      </div>

      <div className={styles.compose}></div>
      {/* compose editor */}
    </div>
  );

  // return (
  //   <div className={styles.container}>
  //     {/* all users */}
  //     <div className="border-sky-500 border p-4">
  //       <span className="flex items-center">
  //         <h1>Between:({convo.conversationBetween?.length ?? 0}): </h1>
  //         {convo.conversationBetween?.map((member, index) => (
  //           <span
  //             key={index}
  //             className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
  //           >
  //             {member.alias}
  //           </span>
  //         ))}
  //       </span>
  //     </div>

  //     {/* currently online count  */}
  //     <div className="border border-red-500 p-4">
  //       <h1>Currently online: {chatSocketState.userActiveCount}</h1>
  //       {Object.values(chatSocketState.users).map((user, index) => (
  //         <span
  //           key={index}
  //           className="border-violet-300 bg-violet-600 border-2 bg-clip-border p-1"
  //         >
  //           {user.alias}
  //         </span>
  //       ))}
  //     </div>

  //     {/* user info (optional) */}
  //     <div className="border border-green-500 p-4">
  //       <h1>Your info</h1>
  //       <p>id - name - email - role</p>
  //       <p>
  //         {user.id} - {`${user.firstName} ${user.lastName}`} - {user.email} -{' '}
  //         {user.role.name}
  //       </p>
  //     </div>

  //     {/* send message button */}
  //     <button
  //       className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
  //       onClick={sendMessage}
  //     >
  //       Send message
  //     </button>

  //     {/* messsage display */}
  //     <div>
  //       {chatSocketState.messages.map((e) => (
  //         <div key={e.id} color={e.from === user.id ? 'blue' : 'black'}>
  //           {e.content} by {e.from !== user.id ? e.from : 'you'} (at{' '}
  //           {new Date(e.at).toDateString()})
  //         </div>
  //       ))}
  //       <div color="blue">{chatSocketState.messagePending}</div>
  //     </div>
  //   </div>
  // );
}

export default Conversation;

// todo: chat socket redux state, merge convo and convoGroup then flat
//      them to the base props level

//#region hooks
// function use
//#endregion

//#region utils
// todo: refactor, duplicate logic with chat entry
function extractUnionConvo(state: ChatSocketEntity) {
  const { convoId, conversation, conversationGroup } = state;
  const convo = {
    id: convoId,
    ...conversation,
    ...conversationGroup,
  } satisfies ConvoUnionType;

  return convo;
}

function extractTitleName(
  convo: ConvoUnionType,
  members?: MinimalUserEntity[]
) {
  if (!Convo.isGroup(convo)) {
    const interculator = members?.at(0);
    return interculator ? User.getFullName(interculator) : '[interlocutor]';
  }
  return convo.name;
}

function filterMembers(convo: ConvoUnionType, mainUserId: number) {
  const unfiltedMembers = !Convo.isGroup(convo)
    ? convo.conversationBetween
    : convo.members;

  return unfiltedMembers?.filter((m) => m.id !== mainUserId);
}

/* function getLatestMessage(messages?: MessageEntity[]) {
  if (!messages || !messages.length) return;

  const latestMsg = messages.reduce((former, latter) =>
    former.at > latter.at ? former : latter
  );

  return {
    ...latestMsg,
    at: formatTimeReadable(latestMsg.at),
  };
} */
//#endregion
