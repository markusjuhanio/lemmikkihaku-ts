import React, { useEffect, useState } from 'react';
import { ArrowBack } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography, Divider, Alert, Button } from '@mui/material';
import { OwnUser, PublicConversation, PublicUser, SocketAction, TypingUser } from '../../../../../../types';
import Message from './Message';
import Inputs from '../Inputs';
import { useAppDispatch, useIsUserOnline, useUsersTypingToMe } from '../../../../../../hooks';
import { setSelectedConversation } from '../../../../../../reducers/selectedConversation';
import { deleteMessage } from '../../../../../../reducers/conversationsReducer';
import { MAX_SAVED_MESSAGES_IN_CONVERSATION } from '../../../../../../constants';
import { socket } from '../../../../../../socket';
import { scrollToBottomOfMessages } from '../../../../../../utils';

interface MessagesProps {
  user: OwnUser | null,
  selectedConversation: PublicConversation,
  getPerson: (conversation: PublicConversation) => PublicUser,
}

const Messages = (props: MessagesProps) => {
  const { user, selectedConversation, getPerson } = props;
  const dispatch = useAppDispatch();
  const isOnline = useIsUserOnline(getPerson(selectedConversation).id);
  const usersTypingToMe = useUsersTypingToMe();
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [conversationMessageLimitAlertChecked, setConversationMessageLimitAlertChecked] = useState<boolean>(localStorage.getItem('conversationMessageLimitAlertChecked') ? true : false);

  useEffect(() => {
    socket.on(SocketAction.NEW_MESSAGE, () => {
      setSendingMessage(false);
      scrollToBottomOfMessages('smooth');
    });
    return () => {
      if (user) {
        const to: string = getPerson(selectedConversation).id;
        const typingUser: TypingUser = { from: user.id, to: to, isTyping: false, date: Date.now() };
        socket.emit(SocketAction.STOP_TYPING_MESSAGE, typingUser);
      }
      closeConversation();
    };
  }, []);

  useEffect(() => {
    /* Close conversation on browser back button */
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = () => {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      window.onpopstate = () => { };
      closeConversation();
    };
  }, []);

  const isPersonTypingToMe = (): boolean => {
    const personId: string = getPerson(selectedConversation).id;
    const typingUser = usersTypingToMe.find(user => user.from === personId);
    if (typingUser) {
      return typingUser.isTyping;
    }
    return false;
  };

  const closeConversation = (): void => {
    localStorage.removeItem('selectedConversation');
    dispatch(setSelectedConversation(null));
  };

  const handleDeleteMessageClientSide = (messageId: string): void => {
    dispatch(deleteMessage({ messageId: messageId, conversationId: selectedConversation.id }));
  };

  const handleCheckConversationMessageLimitAlert = (): void => {
    localStorage.setItem('conversationMessageLimitAlertChecked', 'true');
    setConversationMessageLimitAlertChecked(true);
  };

  return (
    <Box sx={{ pb: 2 }}>
      <Paper>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2
        }}>
          <IconButton onClick={closeConversation} color='primary'>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant='h6'>
              {getPerson(selectedConversation).nickname}
            </Typography>
            <Typography variant='body2' sx={{ fontSize: 12, opacity: 0.75, mt: '-3px' }}>
              {isPersonTypingToMe()
                ? 'kirjoittaa...'
                : isOnline === null ? 'ladataan...' : isOnline ? 'paikalla' : 'ei paikalla'
              }
            </Typography>
          </Box>
        </Box>

        <Divider />

        {!conversationMessageLimitAlertChecked && (
          <Alert action={<Button onClick={handleCheckConversationMessageLimitAlert} color='secondary' size='small'>Ok</Button>} sx={{ borderRadius: 0 }} severity='info'>
            <Typography variant='body2'>
              Keskustelu säilyttää maksimissaan {MAX_SAVED_MESSAGES_IN_CONVERSATION} uusinta viestiä.
            </Typography>
          </Alert>
        )}

        <Box
          id='message-container'
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            overflow: 'scroll',
            maxHeight: { xs: 285, sm: 350 },
            minHeight: { xs: 285, sm: 350 },
            transform: 'translate3d(0, 0, 0)'
          }}>
          {selectedConversation.messages.map((message, i) => (
            <Message
              key={i}
              user={user}
              message={message}
              selectedConversation={selectedConversation}
              handleDeleteMessageClientSide={handleDeleteMessageClientSide}
            />
          ))}
        </Box>
        <Divider />
        <Inputs
          user={user}
          getPerson={getPerson}
          selectedConversation={selectedConversation}
          sendingMessage={sendingMessage}
          setSendingMessage={setSendingMessage}
        />
      </Paper >
    </Box >
  );
};

export default Messages;