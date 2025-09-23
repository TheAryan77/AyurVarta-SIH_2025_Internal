import React, { useState } from 'react';
import styles from './Auth.module.css';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const e = {};
    if (mode === 'signup' && !form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = e.email || 'Enter a valid email';
    if (!form.password.trim()) e.password = 'Password is required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Integrate Firebase auth here
    // if (mode === 'login') firebase.signInWithEmailAndPassword(...)
    // else firebase.createUserWithEmailAndPassword(...)
    alert(`${mode === 'login' ? 'Logged in' : 'Account created'} (placeholder)`);
  };

  const googleSignIn = () => {
    // TODO: Firebase Google provider sign-in
    alert('Google Sign-In (placeholder)');
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.wrap}>
        <div className={styles.panel}>
          <h2 className={styles.title}>Welcome</h2>
          <p className={styles.sub}>Login to your account or create a new one.</p>

          <div className={styles.seg} role="tablist" aria-label="Auth mode">
            <button className={`${styles.segBtn} ${mode === 'login' ? styles.active : ''}`} onClick={() => setMode('login')} role="tab" aria-selected={mode==='login'}>
              Login
            </button>
            <button className={`${styles.segBtn} ${mode === 'signup' ? styles.active : ''}`} onClick={() => setMode('signup')} role="tab" aria-selected={mode==='signup'}>
              Sign Up
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div className={styles.row}>
                <label className={styles.label} htmlFor="name">Full Name</label>
                <input id="name" name="name" className={styles.input} value={form.name} onChange={onChange} />
                {errors.name && <div className={styles.error}>{errors.name}</div>}
              </div>
            )}
            <div className={styles.row}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input id="email" name="email" type="email" className={styles.input} value={form.email} onChange={onChange} />
              {errors.email && <div className={styles.error}>{errors.email}</div>}
            </div>
            <div className={styles.row}>
              <label className={styles.label} htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className={styles.input} value={form.password} onChange={onChange} />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.primary}>{mode === 'login' ? 'Login' : 'Create Account'}</button>
              <div className={styles.hint}>We’ll add Google sign-in soon.</div>
            </div>
          </form>
        </div>

        <aside className={styles.aside}>
          <h3>Quick Access</h3>
          <p className={styles.sub}>Use a social account to continue.</p>
          <div className={styles.providers}>
            <button className={styles.provider} onClick={googleSignIn}>Continue with Google</button>
            <button className={styles.provider} disabled>Continue with Apple (soon)</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Auth;
