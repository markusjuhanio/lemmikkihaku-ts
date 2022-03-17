import React from 'react';
import { Avatar, Tooltip, Typography } from '@mui/material';
import { isEmptyString } from '../utils';

interface UserAvatarProps {
  name: string | undefined,
  color: string | undefined,
  size: number
}
const UserAvatar = (props: UserAvatarProps) => {
  const { name, color, size } = props;

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

  return (
    <Tooltip title={getName()}>
      <Avatar color={color} sx={{ width: size, height: size, background: color }}>
        <Typography variant='h6' sx={{ color: '#FFF' }}>
          {getCharacter()}
        </Typography>
      </Avatar>
    </Tooltip>
  );
};

export default UserAvatar;