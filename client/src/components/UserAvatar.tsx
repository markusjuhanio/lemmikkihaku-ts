import React from 'react';
import { Avatar, Typography, Badge, Theme, useTheme, Tooltip } from '@mui/material';
import { isEmptyString } from '../utils';
import { useIsUserOnline } from '../hooks';
import { styled } from '@mui/styles';

interface UserAvatarProps {
  name: string | undefined,
  color: string | undefined,
  size: number,
  id: string,
  statusVisible: boolean
}
const UserAvatar = (props: UserAvatarProps) => {
  const { name, color, size, id, statusVisible } = props;

  const theme: Theme = useTheme();
  const isOnline = useIsUserOnline(id);

  const getName = (): string => {
    if (name && !isEmptyString(name)) {
      return name;
    }
    return 'undefined';
  };

  const getCharacter = (): string => {
    const parsedName: string = getName();
    return parsedName.charAt(0);
  };

  const getTitle = (): string => {
    return `${getName()} ${statusVisible ? isOnline === null ? 'ladataan...' : isOnline ? '(paikalla)' : '(ei paikalla)' : '' }`;
  };

  const StyledBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
      border: `2px solid ${theme.palette.background.paper}`,
      height: 10,
      width: 10,
      borderRadius: '50%',
      bottom: 7,
      right: 7
    },
  }));

  return (
    <StyledBadge overlap='circular' anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} invisible={!statusVisible} variant='dot' color={isOnline === null ? 'warning' : isOnline ? 'success' : 'error'}>
      <Tooltip title={getTitle()}>
        <Avatar color={color} sx={{ width: size, height: size, background: color }}>
          <Typography variant='h6' sx={{ color: '#FFF', fontSize: 20 }}>
            {getCharacter()}
          </Typography>
        </Avatar>
      </Tooltip>
    </StyledBadge>
  );
};

export default UserAvatar;