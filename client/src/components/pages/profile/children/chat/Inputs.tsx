import React, { useRef, useState } from 'react';
import { Box, TextField, IconButton, Theme, useTheme, CircularProgress } from '@mui/material';
import { CameraAlt, Delete, Send } from '@mui/icons-material';
import { fileToImage, isEmptyString } from '../../../../../utils';
import { IUseField, MessageEntry, OwnUser, Severity, PublicConversation, PublicUser, Image, SocketAction, TypingUser } from '../../../../../types';
import { useAppDispatch, useField } from '../../../../../hooks';
import conversationService from '../../../../../services/conversationService';
import { showToast } from '../../../../../reducers/toastReducer';
import { socket } from '../../../../../socket';

interface InputsProps {
  user: OwnUser | null,
  selectedConversation: PublicConversation,
  getPerson: (conversation: PublicConversation) => PublicUser,
  sendingMessage: boolean,
  setSendingMessage: React.Dispatch<React.SetStateAction<boolean>>,
}

const Inputs = (props: InputsProps) => {
  const { user, selectedConversation, getPerson, sendingMessage, setSendingMessage } = props;
  const text: IUseField = useField('text');
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<Image | null>(null);
  const theme: Theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  const [typingIntervalId, setTypingIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [typingTimeoutId, setTypingTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleSendMessage = async (): Promise<void> => {
    const to: string = getPerson(selectedConversation).id;
    if ((!isEmptyString(text.value) || image) && to) {
      setSendingMessage(true);
      try {
        if (user) {
          const typingUser: TypingUser = { from: user.id, to: to, isTyping: false, date: Date.now() };
          socket.emit(SocketAction.STOP_TYPING_MESSAGE, typingUser);
        }

        const data: MessageEntry = { to: to, message: text.value, conversationId: selectedConversation.id };

        if (image) {
          data.image = image;
        }
        
        text.clear();
        await conversationService.sendMessage(data);
        setImage(null);
        setSendingMessage(false);
      } catch (error) {
        dispatch(showToast({
          open: true,
          severity: Severity.Error,
          message: 'Viestin lähetys epäonnistui.',
          timeout: 5,
        }));
        setSendingMessage(false);
      }
    }
  };

  const handleSelectImage = async (files: FileList | null): Promise<void> => {
    if (files) {
      const file: File = files[0];
      const img = await fileToImage(file);
      if (img) {
        setImage(img);
      }
    }
  };

  const handleTextChange = (value: string): void => {
    text.setValue(value);

    if (typingIntervalId) {
      clearInterval(typingIntervalId);
    }

    if (typingTimeoutId) {
      clearTimeout(typingTimeoutId);
    }

    if (user) {
      const to: string = getPerson(selectedConversation).id;
      const typingUser: TypingUser = { from: user.id, to: to, isTyping: true, date: Date.now() };

      const timeouId = setTimeout(() => {
        socket.emit(SocketAction.START_TYPING_MESSAGE, typingUser);
        clearTimeout(timeouId);
      }, 100);

      let counter = 2;
      const intervalId: NodeJS.Timeout = setInterval(() => {
        counter--;
        if (counter < 0) {
          socket.emit(SocketAction.STOP_TYPING_MESSAGE, { ...typingUser, isTyping: false });
          clearInterval(intervalId);
        }
      }, 1000);

      setTypingIntervalId(intervalId);
      setTypingTimeoutId(timeouId);
    }
  };

  return (
    <Box sx={{
      p: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        flex: 1
      }}>
        {image && (
          <Box sx={{ alignSelf: 'flex-start', position: 'relative', maxHeight: 120 }}>
            <Box sx={{ maxWidth: 120, maxHeight: 120 }}>
              <img
                src={image.url}
                style={{
                  width: '100%',
                  borderRadius: theme.shape.borderRadius,
                  height: '100%',
                  maxHeight: 100,
                  objectFit: 'cover'
                }}
              />
            </Box>
            <IconButton onClick={() => setImage(null)} size='small' sx={{
              position: 'absolute',
              top: 5,
              right: 5,
              background: theme.palette.background.default,
              '&:hover': {
                background: theme.palette.background.paper
              },
            }}>
              <Delete fontSize='small' />
            </IconButton>
          </Box>
        )}
        <TextField
          disabled={sendingMessage}
          value={text.value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => handleTextChange(event.target.value)}
          multiline
          maxRows={10}
          minRows={1}
          inputProps={{
            maxLength: 200
          }}
          fullWidth
          InputProps={{
            endAdornment: (
              <IconButton disabled={Boolean(image)} onClick={() => {
                if (inputRef && inputRef.current) {
                  inputRef.current.click();
                }
              }}>
                <CameraAlt />
              </IconButton>
            )
          }}
          placeholder='Viesti'
        />
      </Box>
      <IconButton
        sx={{ alignSelf: 'center' }}
        disabled={sendingMessage}
        onClick={handleSendMessage}
        color='primary'
        size='large'
      >
        {sendingMessage ? <CircularProgress size={24} /> : <Send />}
      </IconButton>

      <input
        accept='image/jpeg,image/webp,image/png,image/jpg'
        hidden
        ref={inputRef}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSelectImage(event.target.files)}
        type='file'
      />
    </Box >
  );

};

export default Inputs;