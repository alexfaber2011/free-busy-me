import * as React from 'react';
import {Link} from 'react-router-dom';

const HomeScreen: React.FC = () => {
  return (
    <>
      <h2>Welcome home!</h2>
      <Link to="/sign-in">sign in</Link>
    </>
  );
};

export default HomeScreen;
