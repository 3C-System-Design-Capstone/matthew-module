import React from 'react';
import styles from '../css/Arrow.css';

const Arrow = props => (
  <svg viewBox="0 0 24 24" id={styles.arrow} width="100%" height="100%">
    <path
      d="M17.59 7l5 5-5 5M0 12h22"
      fill="none"
      stroke="currentColor"
      strokeMiterlimit="10"
      strokeWidth="2"
    />
  </svg>
);

export default Arrow;