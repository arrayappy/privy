import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles';

const GenericModal: React.FC = () => {
  return ReactDOM.createPortal(
    <div className={styles.container}>
      {/* ... existing content ... */}
    </div>,
    document.body
  );
};

export default GenericModal; 