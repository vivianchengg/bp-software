import React from 'react';
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { Profile } from '../interfaces';
import { Mobile, useWindowDimensions } from '../helper';

interface Props {
  profile: Profile
}

export const WorkerCard = ({ profile }: Props) => {

  let name = profile.name;
  let position = profile.position;
  let picture = profile.picture;

  const { width } = useWindowDimensions();

  if (width <= Mobile) {
    return (
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        flexGrow={1}
        flexBasis={0}
        flexWrap={'nowrap'}
        width={'600px'}
        sx={{
          backgroundColor: 'white',
          height: '50px',
          border: '1px solid #E0E3E7',
          gap: '10px'
        }}
      >
        <Avatar
          alt={name}
          src={picture} />
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
          </style>
          <text style={{
            fontFamily: 'Noto Sans',
            fontSize: '15px',
            color: '#3B3E45',
            WebkitTextStrokeWidth: '0.4px',
            WebkitTextStrokeColor: '#3B3E45',
            letterSpacing: '0.25px',
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '170px',
          }}>
            {name}
          </text>
          <text style={{
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#666E7D',
          }}>
            {position}
          </text>
        </Box>
      </Box>
  );
  }

  return (
      <Box
        display={'flex'}
        flexDirection={'row'}
        justifyContent={'center'}
        alignItems={'center'}
        flexGrow={1}
        flexBasis={0}
        flexWrap={'nowrap'}
        maxWidth={'498px'}
        minWidth={'305px'}
        sx={{
          backgroundColor: 'white',
          height: '50px',
          border: '1px solid #E0E3E7',
          gap: '10px'
        }}
      >
        <Avatar
          alt={name}
          src={picture} />
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap');
          </style>
          <text style={{
            fontFamily: 'Noto Sans',
            fontSize: '15px',
            color: '#3B3E45',
            WebkitTextStrokeWidth: '0.4px',
            WebkitTextStrokeColor: '#3B3E45',
            letterSpacing: '0.25px',
            textOverflow: 'ellipsis',
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            maxWidth: '170px',
          }}>
            {name}
          </text>
          <text style={{
            fontFamily: 'Noto Sans',
            fontSize: '13px',
            color: '#666E7D',
          }}>
            {position}
          </text>
        </Box>
      </Box>
  );
}