import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { SettingBar } from '../components/SettingBar';
import { Profile } from '../components/Profile';
import Divider from '@mui/material/Divider';
import { ServerOptions } from '../components/ServerOptions';
import { useWindowDimensions } from '../helper';

interface Props {
  settingOpen: boolean,
  setSettingOpen: (settingOpen: boolean) => void,
}

export const SettingPage = ({ settingOpen, setSettingOpen }: Props) => {
  const [page, setPage] = useState(0);
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 765;

  const handleBackButton = () => {
    setSettingOpen(true);
  };

  return (
    <>
      <Box display={'flex'} flexDirection={isSmallScreen ? 'column' : 'row'}>
        {(settingOpen || !isSmallScreen) && <SettingBar setPage={setPage} setSettingOpen={setSettingOpen}/>}
        <Divider
          orientation={isSmallScreen ? 'horizontal' : 'vertical'}
          flexItem
        />
        {((!settingOpen && isSmallScreen) || !isSmallScreen) &&
          (page === 0 ? (
            <>
              <Profile handleBackButton={handleBackButton}/>
            </>
          ) : (
            <>
              <ServerOptions handleBackButton={handleBackButton}/>
            </>
          ))}
      </Box>
    </>
  );
};
