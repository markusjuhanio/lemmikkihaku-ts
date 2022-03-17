import React, { MutableRefObject } from 'react';
import { MenuList, Fade, ListItemText, MenuItem, Box, Menu, Typography, Paper, IconButton, Divider } from '@mui/material';
import { AccessTime, Close, Delete } from '@mui/icons-material';
import { ListingEntry, Notification, NotificationType, PublicConversation, PublicListing, PublicMessage, Severity } from '../../types';
import { getPrettyDate, isEmptyString, scrollToMessage, toListingEntry } from '../../utils';
import notificationService from '../../services/notificationService';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { deleteNotification, setNotifications } from '../../reducers/notificationsReducer';
import { showToast } from '../../reducers/toastReducer';
import { useHistory } from 'react-router-dom';
import { setNewListing } from '../../reducers/newListingReducer';
import { LISTING_LIFETIME } from '../../constants';
import { setSelectedConversation } from '../../reducers/selectedConversation';

interface UserMenuProps {
  open: boolean,
  handleClose: () => void,
  anchor: MutableRefObject<null>,
  notifications: Notification[]
}

const NotificationsMenu = (props: UserMenuProps) => {
  const { open, handleClose, anchor, notifications } = props;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const conversations = useAppSelector(state => state.conversations);

  async function checkAll() {
    const checked = notifications.map((notif) => {
      notif.checked = true;
      return notif;
    });
    dispatch(setNotifications(checked));

    for (const notification of notifications) {
      await notificationService.checkNotification(notification.id);
    }
  }

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string): Promise<void> => {
    event.preventDefault();
    event.stopPropagation();
    try {
      dispatch(deleteNotification(id));
      await notificationService.deleteNotification(id);
    } catch (error) {
      dispatch(showToast({
        open: true,
        severity: Severity.Error,
        message: 'Notifikaation poistaminen epäonnistui.',
        timeout: 3
      }));
    }
  };

  const onClose = (): void => {
    handleClose();
    void checkAll();
  };

  const getNotificationTitle = (notification: Notification): string => {
    const type: NotificationType = notification.type;
    switch (type) {
    case NotificationType.NEW_MESSAGE: {
      const message = notification.resource as PublicMessage;
      return `${message.from.nickname} lähetti ${(message.image && !isEmptyString(message.image.url)) ? 'kuvan' : 'viestin'}`;
    }
    case NotificationType.LISTING_ACTIVATED: {
      const listing = notification.resource as PublicListing;
      return `Ilmoitus ${listing.title} julkaistiin`;
    }
    case NotificationType.LISTING_REJECTED: {
      const listing = notification.resource as PublicListing;
      return `Ilmoitus ${listing.title} hylättiin`;
    }
    default:
      return '';
    }
  };

  const getNotificationText = (notification: Notification): string => {
    const type: NotificationType = notification.type;
    switch (type) {
    case NotificationType.NEW_MESSAGE: {
      const resource = notification.resource as PublicMessage;
      return resource.message;
    }
    case NotificationType.LISTING_REJECTED:
      return 'Olethan lukenut käyttöehdot? Voit halutessasi lähettää ilmoituksen uudelleen tarkistettavaksi.';
    case NotificationType.LISTING_ACTIVATED:
      return `Ilmoituksesi on voimassa ${LISTING_LIFETIME} päivää.`;
    default:
      return '';
    }
  };

  const getNotificationAction = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, notification: Notification): void => {
    event.preventDefault();
    event.stopPropagation();

    const type: NotificationType = notification.type;
    switch (type) {
    case NotificationType.NEW_MESSAGE: {
      const message = notification.resource as PublicMessage;
      const conversation: PublicConversation | undefined = conversations.find(c => c.id === message.conversationId);
      if (conversation) {
        history.push({
          pathname: '/oma-sivu',
          state: { tab: 3 }
        });
        dispatch(setSelectedConversation(conversation));
        setTimeout(() => {
          scrollToMessage(message.id, 'smooth');
        }, 50);
      }
    }
      break;
    case NotificationType.LISTING_REJECTED: {
      const listing = notification.resource as ListingEntry;
      dispatch(setNewListing(listing));
      history.push('/ilmoita');
    }
      break;
    case NotificationType.LISTING_ACTIVATED: {
      const listing = notification.resource as PublicListing;
      history.push({
        pathname: `/ilmoitus/${listing.id}`,
        state: { listing: toListingEntry(listing) }
      });
    }
      break;
    default:
      break;
    }
    onClose();
  };

  const getNotificationItem = (notification: Notification) => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Box sx={{ flex: 1, whiteSpace: 'normal' }}>
          <ListItemText><b>{getNotificationTitle(notification)}</b></ListItemText>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime sx={{ opacity: 0.75, fontSize: 16, mb: '1px' }} color='secondary' />
            <Typography sx={{ opacity: 0.75, ml: '5px' }} variant='caption'>
              {getPrettyDate(notification.date)}
            </Typography>
          </Box>
          {!isEmptyString(getNotificationText(notification)) && (
            <Typography sx={{ mt: '3px', whiteSpace: 'pre-line', wordBreak: 'break-word' }} variant='body2'>
              {getNotificationText(notification)}
            </Typography>
          )}
        </Box>
        <IconButton
          size='small'
          sx={{ alignSelf: 'flex-start' }}
          onClick={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleDelete(event, notification.id)}
          onMouseDown={(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => event.stopPropagation()}
          onTouchStart={(event: React.TouchEvent<HTMLButtonElement>) => event.stopPropagation()}
        >
          <Delete fontSize='small' />
        </IconButton>
      </Box>
    );
  };

  return (
    <Menu
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      anchorEl={anchor.current}
      onClose={onClose}
      TransitionComponent={Fade}
    >
      <Box sx={{ maxWidth: 300, minWidth: 300 }}>
        <Paper sx={{ mt: -1, borderBottomRightRadius: 0, borderBottomLeftRadius: 0, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pr: 1, pt: 1, pb: 1 }}>
            <Typography variant='subtitle2'>
              Notifikaatiot
            </Typography>
            <IconButton onClick={onClose} sx={{ ml: 'auto' }} size='small'>
              <Close fontSize='small' />
            </IconButton>
          </Box>
        </Paper>
        <Box sx={{ maxHeight: 400, overflowY: 'scroll' }}>
          <MenuList dense>
            {notifications.length > 0
              ? notifications.map((notification, i) => {
                return <Box key={i}>
                  <MenuItem
                    onClick={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => getNotificationAction(event, notification)}
                    onMouseDown={(event: React.MouseEvent<HTMLLIElement, MouseEvent>) => event.stopPropagation()}
                    onTouchStart={(event: React.TouchEvent<HTMLLIElement>) => event.stopPropagation()}
                  >
                    {getNotificationItem(notification)}
                  </MenuItem>
                  {i < notifications.length - 1 && (<Divider />)}
                </Box>;
              })
              : <Typography sx={{ pl: 2, pr: 2, pt: 1 }} variant='body2'>Sinulla ei ole uusia viestejä.</Typography>
            }
          </MenuList>
        </Box>
      </Box>
    </Menu>
  );
};

export default NotificationsMenu;