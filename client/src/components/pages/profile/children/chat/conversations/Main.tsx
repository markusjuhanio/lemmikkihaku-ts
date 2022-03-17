import React from 'react';
import { Box, Paper, Divider, List } from '@mui/material';
import { OwnUser, PublicConversation, PublicMessage, PublicUser } from '../../../../../../types';
import Conversation from './Conversation';

interface ConversationProps {
  user: OwnUser | null,
  getPerson: (conversation: PublicConversation) => PublicUser,
  getLastMessage: (conversation: PublicConversation) => PublicMessage,
  conversations: PublicConversation[]
}

const Conversations = (props: ConversationProps) => {
  const { user, getPerson, getLastMessage, conversations } = props;

  return (
    <Box>
      <Paper sx={{ pt: 1, pb: 1 }}>
        <List sx={{ width: '100%' }} >
          {conversations.map((conversation, i) => (
            <Box key={i}>
              <Conversation
                conversation={conversation}
                getPerson={getPerson}
                getLastMessage={getLastMessage}
                user={user}
              />
              {i < conversations.length - 1 && (<Divider />)}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Conversations;