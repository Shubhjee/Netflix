import React, { useEffect, useState } from "react";
import "./Row.css";
import ax from "../../Axios/axios";
import axios from "axios";
import Details from "../Details/Details";
import Loading from "../Loading/Loading";
import { useRef } from "react";
import { ClickAwayListener } from "@material-ui/core";
import { BASE_URL } from "../../Axios/requests";

function Row({ title, fetchUrl, isLargeRow, isSearch, SearchResult }) {
  const [items, setItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const mainRef = useRef(null);

  useEffect(() => {
    setShowDetails(false);
    setItemDetails(null);

    const source = axios.CancelToken.source();
    async function fetchData() {
      setLoading(true);
      await ax
        .get(fetchUrl, { cancelToken: source.token })
        .then((response) => {
          if (isLargeRow) {
            const data = response.data.results.filter(
              (item) => item?.poster_path
            );
            setItems(data);
          } else {
            const data = response.data.results.filter(
              (item) => item?.backdrop_path
            );
            setItems(data);
          }
          setLoading(false);
        })
        .catch(() => {
          console.log("Request Failed!");
          setLoading(false);
        });
    }

    if (!isSearch) {
      fetchData();
    } else {
      setItems(SearchResult);
      setLoading(false);
    }

    return () => {
      setShowDetails(false);
      setItemDetails(null);
      source.cancel();
    };
  }, [fetchUrl, isSearch, SearchResult, isLargeRow]);

  const handleClick = (ItemDetails) => {
    mainRef.current.style.height = `auto`;
    if (showDetails && ItemDetails === itemDetails) {
      closeDetails();
    } else {
      setItemDetails(ItemDetails);
      setShowDetails(true);
      mainRef.current.addEventListener("animationend", () => {
        mainRef.current.focus();
      });
      mainRef.current.focus();
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    mainRef.current.style.height = `${mainRef.current.offsetHeight}px`;
    setItemDetails(null);
  };

  if (items?.length === 0) {
    return <></>;
  }

  return (
    <ClickAwayListener onClickAway={closeDetails}>
      <div className="row">
        {loading && (
          <Loading
            LoaderType="ThreeDots"
            addStyle={{
              backgroundColor: "#141414",
              position: "absolute",
              top: "0",
              right: "0",
              bottom: "0",
              left: "0",
            }}
          />
        )}
        <h2>{title}</h2>
        <div
          className={`row__posters ${isLargeRow ? "large__posters" : ""}`}
          style={loading ? { minHeight: "180px" } : {}}
        >
          {items?.map((item) => (
            <img
              src={`${BASE_URL}${
                isLargeRow ? item?.poster_path : item?.backdrop_path
              }`}
              key={item?.id}
              alt=""
              onClick={() => handleClick(item)}
              className={`row__poster ${isLargeRow ? "row__posterLarge" : ""}`}
            />
          ))}
        </div>
        <div
          className={`row__details ${showDetails ? "row__detailsShow" : ""}`}
          tabIndex="-1"
          ref={mainRef}
        >
          <Details itemDetails={itemDetails} handleClose={closeDetails} />
        </div>
      </div>
    </ClickAwayListener>
  );
}

export default Row;
