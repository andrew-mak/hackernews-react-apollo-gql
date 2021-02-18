import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AUTH_TOKEN } from '../../constants';

const Header = () => {
  const history = useHistory();
  const authToken = localStorage.getItem(AUTH_TOKEN);
  const logoutHandler = () => {
    localStorage.removeItem(AUTH_TOKEN);
    history.push(`/`);
  }
  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <div className="fw7 mr1">Hacker News</div>
        <Link to="/"
          className="ml1 no-underline black">
          new
        </Link>
        <div className="ml1">|</div>
        <Link to="/top"
          className="ml1 no-underline black">
          Top
        </Link>
        <div className="ml1">|</div>
        <Link
          to="/search"
          className="ml1 no-underline black">
          Search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="ml1">|</div>
            <Link
              to="/create"
              className="ml1 no-underline black">
              Submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={logoutHandler}>
            Logout
          </div>
        ) : (
            <Link
              to="/login"
              className="ml1 no-underline black">
              login
            </Link>
          )}
      </div>
    </div>
  );
};

export default Header;