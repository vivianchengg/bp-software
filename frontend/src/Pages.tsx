import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientPage } from './pages/PatientPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { TopBar, User } from './components/TopBar';
import Box from '@mui/material/Box';
import { SideBar } from './components/SideBar';
import { SettingPage } from './pages/SettingPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResetPasswordPage } from './pages/ResetPassword';
import { apiCall } from './helper';
import { ConfirmResetPasswordPage } from './pages/Password';
import { ChangeServerPage } from './pages/ChangeServerPage';
import { useWindowDimensions } from './helper';
import { MobileBar } from './components/MobileBar';
import { VerifyEmailPage } from './pages/VerifyEmailPage';

export const Pages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const noLayoutRoutes = ['/login', '/signup', '/profile', '/reset', '/reset-password', '/changeServer', '/verify-email'];
  const [pBarOpen, setPBarOpen] = useState(true);
  const [settingOpen, setSettingOpen] = useState(true);
  const [ curUser, setCurUser ] = useState<User | null>(null);

  // Check if current user is valid by checking current token and userId on reload/change page.
  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await apiCall('GET', '/auth/check_verify', {}, true);

        // If error reset token and userid and go back to the login page
        if (res.error || (res.success && !res.verified)) {
          localStorage.removeItem('token');
          localStorage.removeItem('curUserId');
        }
        const token = localStorage.getItem('token');

        if (!token && !noLayoutRoutes.includes(location.pathname)) {
          navigate('/login');
        } else if (token && noLayoutRoutes.includes(location.pathname)) {
          navigate('/landing');
        }
        return token;
      } catch (error) {
        console.error("Token verification error:", error);
        return null;
      }
    };
  
    const fetchUser = async () => {
      const userId = localStorage.getItem('curUserId');
      if (!userId) {
        return;
      }
  
      const res = await apiCall('GET', `/auth/getProfile?userId=${userId}`, {}, true);
      if (res.error) {
        console.log(res.error);
        return;
      }
  
      const user = res.user[0];
      setCurUser(user);
    };
  
    const init = async () => {
      const token = await checkToken();
      if (token) {
        await fetchUser();
      }
      setLoading(false);
    };
  
    init();
  }, [location.pathname, navigate]);
  
  // Get the current dimension of user's screen for mobile responsive.
  const { width } = useWindowDimensions();

  if (loading) {
    return <div/>;
  }

  return (
    <>
      {/* Pages that have the same layout and Pages that don't rendered differently */}
      {!noLayoutRoutes.includes(location.pathname) ? (
        <Box display={'flex'}
          sx={{
            height: '100vh',
            width: '100vw',
        }}>
          {width > 600 && <SideBar pBarOpen={pBarOpen} setPBarOpen={setPBarOpen} setSettingOpen={setSettingOpen} settingOpen={settingOpen}/>}
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            {width > 600 && curUser ? <TopBar curUser={curUser}/> : (curUser && <MobileBar curUser={curUser}/>)}
            <Box
              sx={{
                mt: '64px'
              }}
            >
              <Routes>
                <Route path="/*" element={<LandingPage />} />
                <Route path="/patient" element={<PatientPage pBarOpen={pBarOpen} setPBarOpen={setPBarOpen}/>} />
                <Route path="/appointment" element={<AppointmentPage />} />
                <Route path="/setting" element={<SettingPage setSettingOpen={setSettingOpen} settingOpen={settingOpen}/>} />
              </Routes>
            </Box>
          </Box>
        </Box>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/changeServer" element={<ChangeServerPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reset" element={<ResetPasswordPage />} />
          <Route path="/reset-password/" element={<ConfirmResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Routes>
      )}
    </>
  );
};
