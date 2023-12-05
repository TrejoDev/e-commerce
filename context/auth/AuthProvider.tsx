import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { signOut, useSession } from "next-auth/react";

import axios from 'axios';
import Cookie from 'js-cookie'

import { AuthContext, authReducer } from './';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE);
  const { data, status } = useSession(); 
  const router = useRouter();

  useEffect(() => {
    if( status === 'authenticated' ){
      // console.log(data?.user)
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser })
    }
  }, [status, data]);
  
  
  /* useEffect(() => {
    checkToken();
  }, []) */

  const checkToken =async () => {

    if( !Cookie.get('token') ) return;
    
    try {
      const { data } = await tesloApi.get('/user/validate-token');
      const { user, token } = data;

      Cookie.set( 'token', token );
      dispatch({ type: '[Auth] - Login', payload: user })
    } catch (error) {
      console.log(error)
      Cookie.remove('token');
    }

  }
  


  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookie.set( 'token', token );
      dispatch({ type: '[Auth] - Login', payload: user })
      return true;
      
    } catch (error) {
      return false;
    }
  }

  const registerUser = async (name: string ,email: string, password: string): Promise<{hasError: boolean; message?: string}> => {
    try {
      const { data } = await tesloApi.post('/user/register', {name, email, password });
      const { token, user } = data;
      Cookie.set( 'token', token );
      dispatch({ type: '[Auth] - Login', payload: user })
      return {
        hasError: false
      }
      
    } catch (error) {
      if( axios.isAxiosError(error) ){
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'Could not create user, please try again!'
      }
    }
  }

  const logout = () => {
    Cookie.remove('cart');
    
    Cookie.remove('firstName');
    Cookie.remove('lastName');
    Cookie.remove('address');
    Cookie.remove('address2');
    Cookie.remove('zip');
    Cookie.remove('city');
    Cookie.remove('country');
    Cookie.remove('phone');
    
    signOut();
    // router.reload();  //Realiza un refresh de la app
    // Cookie.remove('token');
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // Properties

        // Methods
        loginUser,
        logout,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};