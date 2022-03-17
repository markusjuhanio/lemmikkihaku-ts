import React from 'react';
import { Box, CardActionArea, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import { Delete, Photo } from '@mui/icons-material';
import { OwnUser, PublicConversation, PublicMessage, PublicUser, Severity } from '../../../../../../types';
import UserAvatar from '../../../../../UserAvatar';
import { useAppDispatch, useUsersTypingToMe } from '../../../../../../hooks';
import { deleteConversation } from '../../../../../../reducers/conversationsReducer';
import { confirm } from '../../../../../../confirmer';
import conversationService from '../../../../../../services/conversationService';
import { showToast } from '../../../../../../reducers/toastReducer';
import { setSelectedConversation } from '../../../../../../reducers/selectedConversation';
import { scrollToBottomOfMessages } from '../../../../../../utils';

interface ConversationProps {
  user: OwnUser | null,
  getPerson: (conversation: PublicConversation) => PublicUser,
  getLastMessage: (conversation: PublicConversation) => PublicMessage,
  conversation: PublicConversation
}

const Conversation = (props: ConversationProps) => {
  const { user, getPerson, getLastMessage, conversation } = props;
  const dispatch = useAppDispatch();
  const usersTypingToMe = useUsersTypingToMe();

  const isPersonTypingToMe = (): boolean => {
    const personId: string = getPerson(conversation).id;
    const typingUser = usersTypingToMe.find(user => user.from === personId);
    if (typingUser) {
      return typingUser.isTyping;
    }
    return false;
  };

  const handleSelectConversation = (): void => {
    dispatch(setSelectedConversation(conversation));
    setTimeout(() => {
      scrollToBottomOfMessages();
    }, 5);
  };

  const handleDeleteConversation = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();
    if (user) {
      const confirmed = await confirm('Keskustelu poistetaan vain sinulta.');
      if (confirmed) {
        try {
          const data: { conversationId: string } = { conversationId: id };
          await conversationService.softDeleteConversation(data);
          dispatch(deleteConversation(id));
          dispatch(showToast({
            open: true,
            severity: Severity.Success,
            message: 'Keskustelu poistettiin.',
            timeout: 3,
          }));
        } catch (error) {
          dispatch(showToast({
            open: true,
            severity: Severity.Error,
            message: 'Keskustelun poistaminen epäonnistui.',
            timeout: 3,
          }));
        }
      }
    }
  };

  return (
    <CardActionArea onClick={handleSelectConversation}>
      <ListItem>
        <Box sx={{ mr: '10px' }}>
          <UserAvatar statusVisible={true} id={getPerson(conversation).id} name={getPerson(conversation).nickname} color={getPerson(conversation).avatarColor} size={40} />
        </Box>
        <ListItemText
          primary={getPerson(conversation).nickname}
          secondary={
            <Box sx={{ display: 'flex', alignItems: 'center' }}> {conversation.messages.length > 0 && getLastMessage(conversation).image && getLastMessage(conversation).image.url && (
              <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.75 }}>
                <Photo sx={{ mr: '5px' }} fontSize='small' />
              </Box>
            )}
            <Typography variant='caption' sx={{
              opacity: 0.75,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {isPersonTypingToMe() ? 'kirjoittaa...' : conversation.messages.length > 0 ? getLastMessage(conversation).message : 'Ei viestejä.'}
            </Typography>
            </Box>
          }
        />
        <IconButton
          onClick={(event) => handleDeleteConversation(event, conversation.id)}
          onMouseDown={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => event.stopPropagation()}
          onTouchStart={(event: React.TouchEvent<HTMLButtonElement>) => event.stopPropagation()}
        >
          <Delete />
        </IconButton>
      </ListItem>
    </CardActionArea>
  );
};

export default Conversation;