import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './src/redux/store';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './src/navigators/BottomTab';
import AuthStack from './src/navigators/AuthStack';
import { setToken } from './src/redux/UserSlice';
import storage from './src/storage';
// import { me } from './src/services/authService';

const App = () => {
  const userState = useSelector((state: RootState) => state.User);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const loadUser = async () => {
  //     if (storage.contains('token')) {
  //       const token = storage.getString('token');
  //       dispatch(setToken({ token }));

  //       // ✅ Token varsa kullanıcı bilgilerini çek eğer 403 dönerse tokeni sil
  //       await me(dispatch)
  //         .then(() => { })
  //         .catch(() => {
  //           storage.delete('token');
  //           dispatch(setToken({ token: null }));
  //         });
  //     }
  //   };

  //   loadUser();
  // }, []);

  // useEffect(() => {
  //   if (userState.token) {
  //     me(dispatch);
  //   }
  // }, [userState.token]);

  return (
    <NavigationContainer>
      {!userState.token ? <BottomTab /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;
