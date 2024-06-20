import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink
            to="/"
            end
            className="nav-link"
            activeClassName="active"
            aria-current={(match) => (match ? 'page' : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            className="nav-link"
            activeClassName="active"
            aria-current={(match) => (match ? 'page' : undefined)}
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            className="nav-link"
            activeClassName="active"
            aria-current={(match) => (match ? 'page' : undefined)}
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
