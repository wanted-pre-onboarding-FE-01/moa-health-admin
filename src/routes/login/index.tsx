import { ChangeEvent, FocusEvent, FormEvent, useEffect, useState } from 'react';
import { cx } from 'styles';
import { getCookie, setCookie } from 'react-use-cookie';

import { useLogin } from '../../hooks/useLogin';

import Popup from 'components/popup';
import StoreID from './StoreID';
import { HidePasswordIcon, ShowPasswordIcon } from 'assets/svgs';
import styles from './login.module.scss';

const Login = () => {
  const onLogin = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassWord, setShowPassword] = useState(false);
  const [usernameAlert, setUsernameAlert] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState(false);
  const [checkValue, setCheckValue] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const usernameCookie = getCookie('usernameCookie');
    if (usernameCookie) {
      setCheckValue(true);
      setUsername(usernameCookie);
    }
  }, []);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    if (value !== '') {
      setUsernameAlert(false);
    }
    setUsername(value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = e;
    if (value !== '') {
      setPasswordAlert(false);
    }
    setPassword(value);
  };

  const handleOnBlur = (e: FocusEvent<HTMLInputElement>) => {
    const {
      currentTarget: { id },
    } = e;
    if (!username && id === 'username') {
      setUsernameAlert(true);
    }
    if (!password && id === 'password') {
      setPasswordAlert(true);
    }
  };

  const handleShowPassword = () => {
    setShowPassword((pre) => !pre);
  };

  const onFailHandler = (message: string) => {
    setPopupMessage(message);
    setPopupOpen(true);
  };

  const rememberIdHandler = (rememberId: string, isRemember: boolean) => {
    if (isRemember) {
      setCookie('usernameCookie', rememberId, {
        days: 7,
      });
    } else {
      setCookie('usernameCookie', '', { days: 0 });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === '') {
      setUsernameAlert(true);
    }
    if (password === '') {
      setPasswordAlert(true);
    }
    if (password === '' || username === '') {
      return;
    }
    onLogin(username, password, checkValue, onFailHandler, rememberIdHandler);
  };

  return (
    <div className={styles.loginWrapper}>
      <Popup message={popupMessage} open={popupOpen} setOpen={setPopupOpen} status='error' />
      <main className={styles.mainWrapper}>
        <section className={styles.contentWrapper}>
          <h1 className={styles.loginTitle}>?????????</h1>
          <form onSubmit={handleSubmit} className={styles.loginContent}>
            <fieldset className={styles.inputWrapper}>
              <label htmlFor='username'>?????????</label>
              <input
                type='text'
                id='username'
                placeholder='???????????? ??????????????????'
                value={username}
                onChange={handleUsernameChange}
                onBlur={handleOnBlur}
                autoCapitalize='off'
                autoCorrect='off'
                autoComplete='off'
                spellCheck='false'
              />
            </fieldset>
            {usernameAlert && <p className={styles.alertMessage}>???????????? ??????????????????.</p>}

            <fieldset className={styles.inputWrapper}>
              <label htmlFor='password'>????????????</label>
              <input
                type={showPassWord ? 'text' : 'password'}
                id='password'
                placeholder='??????????????? ??????????????????'
                value={password}
                onChange={handlePasswordChange}
                onBlur={handleOnBlur}
                autoCapitalize='off'
                autoCorrect='off'
                autoComplete='off'
                spellCheck='false'
              />
              <button type='button' onClick={handleShowPassword}>
                {showPassWord ? <ShowPasswordIcon /> : <HidePasswordIcon />}
              </button>
            </fieldset>
            {passwordAlert && <p className={styles.alertMessage}>??????????????? ??????????????????.</p>}

            <StoreID checkValue={checkValue} setCheckValue={setCheckValue} />

            <button
              type='submit'
              className={cx(
                styles.loginButton,
                { [styles.buttonValid]: username && password },
                { [styles.buttonDisabled]: !username || !password }
              )}
            >
              ?????????
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Login;
