import React from 'react';
import { Box, Typography } from '@mui/material';
import { OwnUser, PublicConversation, PublicUser, PublicMessage } from '../../../../../types';
import PageSectionHeader from '../../../../PageSectionHeader';
import Conversations from './conversations/Main';
import Messages from './messages/Main';
import { useAppSelector } from '../../../../../hooks';

interface ChatProps {
  user: OwnUser | null
}

const Main = (props: ChatProps) => {
  const { user } = props;
  const selectedConversation = useAppSelector(state => state.selectedConversation);
  const conversations: PublicConversation[] = useAppSelector(state => state.conversations);

  /* 
    useEffect(() => {
      async function init() {
        const response = await conversationService.getConversations();
        const ownConversations: PublicConversation[] = response.data;
        dispatch(setConversations(ownConversations));
        setLoading(false);
      }
      void init();
    }, []);
  */

  const getPerson = (conversation: PublicConversation): PublicUser => {
    return user?.id === conversation.from.id ? conversation.to : conversation.from;
  };

  const getLastMessage = (conversation: PublicConversation): PublicMessage => {
    return conversation.messages[conversation.messages.length - 1];
  };

  const getTitle = (): string => {
    let title = 'Omat keskustelut';
    if (conversations.length > 0) {
      title += ` · ${conversations.length}`;
    }
    return title;
  };

  return (
    <Box>
      <PageSectionHeader title={getTitle()} />
      {selectedConversation
        ? <Messages
          user={user}
          getPerson={getPerson}
          selectedConversation={selectedConversation}
        />
        : conversations.length > 0
          ? <Conversations
            user={user}
            getPerson={getPerson}
            conversations={conversations}
            getLastMessage={getLastMessage}
          />
          : <Typography sx={{ mt: -2 }} variant='body2'>
            Voit aloittaa uusia keskusteluja lähettämällä viestin ilmoituksen kautta.
          </Typography>
      }
    </Box>
  );
};

export default Main;