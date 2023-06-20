import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import styles from './conversation.module.scss';
import { useConvoEventHandlers } from './event-handlers';

import { useDispatch, useSelector } from '@/hooks';
import {
  chatSocketActions as actions,
  ChatSocketRecord as SocketRecord,
  selectAuth,
  selectChatSocketById,
} from '@/stores';
import { chatSocketEvents as events } from '@/types';

// note: take a lock into "Wysiwyg Editor", for typing message
export function Conversation() {
  const dispatch = useDispatch();

  const { convoId: id = '' } = useParams();

  const { sendMessage, updateMessage, deleteMessage } =
    useConvoEventHandlers(id);

  const { token } = useSelector(selectAuth);
  const chatSocketState = useSelector(selectChatSocketById(id));

  const [isLoading, setIsLoading] = useState(true);

  // init socket
  useEffect(() => {
    if (chatSocketState) return;

    const socket = SocketRecord.getOrConnect(id, token);

    // init listeners
    socket.on(events.userConnected.name, ({ chatbox, userActiveCount }) => {
      socket.off(events.userConnected.name);

      socket.on(events.userJoined.name, ({ userActiveCount, userJoinedId }) => {
        dispatch(
          actions.userJoined({ convoId: id, userActiveCount, userJoinedId })
        );
      });

      socket.on(events.userDisconnected.name, ({ id: userId }) => {
        dispatch(actions.userDisconnected({ convoId: id, userId }));
      });

      socket.on(events.exception.name, (err) => {
        if (import.meta.env.DEV) console.log(err);
      });

      dispatch(actions.connectUser({ chatbox, userActiveCount }));
    });

    socket.on(events.messageReceived.name, (payload) => {
      dispatch(actions.messageReceived({ ...payload, convoId: id }));
      dispatch(actions.messagePending({ convoId: id, content: null }));
    });

    socket.on(events.messageDeleted.name, ({ id: msgId }) => {
      dispatch(actions.messageDeleted({ convoId: id, id: msgId }));
    });

    socket.on(events.messageUpdated.name, ({ content, id: msgId }) => {
      dispatch(actions.messageUpdated({ convoId: id, id: msgId, content }));
    });

    return () => {
      socket.off();
      SocketRecord.remove(id);
    };
  }, []);

  useEffect(() => {
    if (!chatSocketState) {
      setTimeout(() => setIsLoading(false), 5000);
    } else {
      setIsLoading(false);
    }
  }, [chatSocketState]);

  if (isLoading) return <div>loading...</div>;

  const convo = chatSocketState?.conversation;

  return <div className={styles.container}></div>;

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
