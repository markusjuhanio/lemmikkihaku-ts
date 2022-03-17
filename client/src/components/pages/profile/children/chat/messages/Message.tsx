import React, { useState } from 'react';
import { Box, Typography, Theme, useTheme } from '@mui/material';
import { Image, OwnUser, PublicConversation, PublicMessage, Severity } from '../../../../../../types';
import UserAvatar from '../../../../../UserAvatar';
import { getPrettyDate, isEmptyString } from '../../../../../../utils';
import ImagePreview from '../ImagePreview';
import { confirm } from '../../../../../../confirmer';
import conversationService from '../../../../../../services/conversationService';
import { useAppDispatch } from '../../../../../../hooks';
import { showToast } from '../../../../../../reducers/toastReducer';

interface MessageProps {
  message: PublicMessage,
  selectedConversation: PublicConversation,
  user: OwnUser | null,
  handleDeleteMessageClientSide: (messageId: string) => void;
}

const Message = (props: MessageProps) => {
  const { message, selectedConversation, user, handleDeleteMessageClientSide: handleDeleteMessage } = props;
  const date: string = getPrettyDate(message.date);
  const theme: Theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const dispatch = useAppDispatch();


  const handleDelete = async (): Promise<void> => {
    const confirmed = await confirm('Viesti poistetaan vain sinulta.');
    if (confirmed) {
      try {
        const data: { messageId: string, conversationId: string } = {
          messageId: message.id,
          conversationId: selectedConversation.id
        };
        handleDeleteMessage(message.id);
        await conversationService.softDeleteMessage(data);
        dispatch(showToast({
          open: true,
          severity: Severity.Success,
          message: 'Viesti poistettiin.',
          timeout: 3,
        }));
      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Viestin poistaminen epäonnistui',
          timeout: 3,
        }));
      }
    }
  };

  return (
    <Box>
      {message.from.id === user?.id
        ? <Box id={message.id} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 1,
        }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{
              background: theme.palette.divider,
              display: 'flex',
              alignItems: 'center',
              borderRadius: `${theme.shape.borderRadius}px`,
              borderBottomRightRadius: 0,
              p: 1
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: isEmptyString(message.message) ? 0 : 1
              }}>
                {message.image && message.image.url && (
                  <Box onClick={() => setSelectedImage(message.image)}>
                    <img
                      src={message.image.url}
                      style={{
                        width: '100%',
                        borderRadius: theme.shape.borderRadius,
                        maxWidth: 100,
                        maxHeight: 100,
                        marginBottom: -5,
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                )}
                <Typography variant='body2' sx={{
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  ml: '3px'
                }}>
                  {message.message}
                </Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              alignSelf: 'flex-end',
              gap: 1,
              pt: '2px'
            }}>
              <Typography onClick={handleDelete} variant='body2' sx={{
                alignSelf: 'flex-end',
                fontSize: 10,
                opacity: 0.5,
                cursor: 'pointer',
                userSelect: 'none'
              }}>
                poista
              </Typography>
              <Typography variant='body2' sx={{
                alignSelf: 'flex-end',
                fontSize: 10,
                opacity: 0.5,
              }}>
                {date}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 'auto' }}>
            <UserAvatar statusVisible={false} id={message.from.id} name={message.from.nickname} color={message.from.avatarColor} size={40} />
          </Box>
        </Box>

        : <Box id={message.id} sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1,
        }}>
          <Box sx={{ mt: 'auto' }}>
            <UserAvatar statusVisible={false} id={message.from.id} name={message.from.nickname} color={message.from.avatarColor} size={40} />
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <Box sx={{
              background: theme.palette.divider,
              display: 'flex',
              alignItems: 'center',
              borderRadius: `${theme.shape.borderRadius}px`,
              borderBottomLeftRadius: 0,
              p: 1
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: isEmptyString(message.message) ? 0 : 1
              }}>
                {message.image && message.image.url && (
                  <Box onClick={() => setSelectedImage(message.image)}>
                    <img
                      src={message.image.url}
                      style={{
                        width: '100%',
                        borderRadius: theme.shape.borderRadius,
                        maxWidth: 100,
                        maxHeight: 100,
                        cursor: 'pointer'
                      }}
                    />
                  </Box>
                )}
                <Typography variant='body2' sx={{
                  maxWidth: '100%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  ml: '3px'
                }}>
                  {message.message}
                </Typography>
              </Box>
            </Box>
            <Typography variant='body2' sx={{
              alignSelf: 'flex-start',
              fontSize: 10,
              opacity: 0.5,
              mt: '2px'
            }}>
              {date}
            </Typography>
          </Box>
        </Box>
      }

      {selectedImage && (
        <ImagePreview selectedImage={selectedImage} setSelectedImage={setSelectedImage} />
      )}
    </Box>
  );
};

export default Message;