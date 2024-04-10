import React, { useRef } from "react";
import "./Nav.css";
import { useEffect } from "react";
import { useState } from "react";
import { ArrowDropDown, Clear, ExpandMore, Search } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { auth } from "../../Config/firebase";
import { actionType } from "../../ContextApi/reducer";
import { useStateValue } from "../../ContextApi/stateProvider";
import { ClickAwayListener } from "@material-ui/core";
import netflixLogo from "../../Images/netflixLogo.png";
import { truncate } from "../../Utils/truncate";

function Nav() {
  const [show, handleShow] = useState(false);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const [expandMore, setExpandMore] = useState(false);
  const [userAvatar, setUserAvatar] = useState(2);
  const inputField = useRef(null);

  useEffect(() => {
    setUserAvatar(Math.floor(Math.random() * 3) + 1);
    const navHandler = () => {
      if (window.scrollY > 50) {
        handleShow(true);
      } else {
        handleShow(false);
      }
    };
    window.addEventListener("scroll", navHandler);
    return () => {
      window.removeEventListener("scroll", navHandler);
    };
  }, []);

  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        dispatch({
          type: actionType.SET_USER,
          user: null,
        });
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const searchHandler = (e) => {
    e.preventDefault();
    history.push(`/search/${query}`);
    setQuery("");
  };

  return (
    <div className={`nav ${show ? "nav__black" : ""}`}>
      <div className="nav__leftSide">
        <Link to="/">
          <img className="nav__logo" src={netflixLogo} alt="netflix logo" />
        </Link>
        <ClickAwayListener onClickAway={() => setExpandMore(false)}>
          <div className="expandMore__content">
            <ExpandMore
              onClick={() => {
                setExpandMore(!expandMore);
              }}
            />
            <div
              className={`nav__links ${!expandMore ? "navMobile__links" : ""}`}
            >
              <span
                style={
                  history.location.pathname === "/" ? { color: "white" } : {}
                }
                onClick={() => history.push("/")}
              >
                Home
              </span>

              <span
                style={
                  history.location.pathname === "/browse/tv"
                    ? { color: "white" }
                    : {}
                }
                onClick={() => history.push("/browse/tv")}
              >
                TV Shows
              </span>

              <span
                style={
                  history.location.pathname === "/browse/movies"
                    ? { color: "white" }
                    : {}
                }
                onClick={() => history.push("/browse/movies")}
              >
                Movies
              </span>

              <span
                style={
                  history.location.pathname === "/browse/latest"
                    ? { color: "white" }
                    : {}
                }
                onClick={() => history.push("/browse/latest")}
              >
                New & Popular
              </span>
            </div>
          </div>
        </ClickAwayListener>
      </div>
      <div className="nav__rightSide">
        {/* Search Field */}

        <form
          onSubmit={searchHandler}
          className={showSearch ? "showSearch" : ""}
        >
          <input
            ref={inputField}
            onBlur={() => {
              setQuery("");
              setShowSearch(false);
            }}
            required
            placeholder="Titles, name ..."
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
          <Search
            style={showSearch ? { zIndex: "1" } : { display: "none" }}
            className="searchIcon"
          />
          {query && <Clear className="searchCross" />}
        </form>
        <Search
          style={
            !showSearch
              ? { animation: "zoomAnimation 0.8s" }
              : { visibility: "hidden" }
          }
          onClick={() => {
            setShowSearch(true);
            inputField.current.focus();
          }}
        />
        <img
          className="nav__avatar"
          src={
            user?.photoURL ? user.photoURL : `/images/users/${userAvatar}.png`
          }
          alt="netflix avatar"
        />
        <span className="nav__userName">
          {truncate(
            user?.displayName ? user?.displayName : user?.email.slice(0, -10),
            15
          )}
        </span>
        <ClickAwayListener onClickAway={() => setShowDropdown(false)}>
          <span className="dropDown__arrow">
            <ArrowDropDown
              onClick={() => {
                setShowDropdown(!showDropdown);
              }}
            />
            <div
              className="dropdown__list"
              style={showDropdown ? {} : { display: "none" }}
            >
              <ul>
                <li>
                  <img
                    className="nav__avatar"
                    src={
                      user?.photoURL
                        ? user.photoURL
                        : `/images/users/${userAvatar}.png`
                    }
                    alt="netflix avatar"
                  />
                  <span>
                    {truncate(
                      user?.displayName
                        ? user?.displayName
                        : user?.email.slice(0, -10),
                      14
                    )}
                  </span>
                </li>
                <li
                  className="dropdown__options"
                  onClick={() => {
                    window.open("https://help.netflix.com/");
                  }}
                >
                  Help Center
                </li>
                <li
                  className="dropdown__options"
                  onClick={() => {
                    signOut();
                  }}
                >
                  Sign out of Netflix
                </li>
              </ul>
            </div>
          </span>
        </ClickAwayListener>
      </div>
    </div>
  );
}

export default Nav;
