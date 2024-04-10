import React, { useEffect, useRef, useState } from "react";
import "./Details.css";
import axios from "../../Axios/axios";
import { Add, Close, PlayArrow } from "@material-ui/icons";
import YouTube from "react-youtube";
import Loading from "../Loading/Loading";
import { API_KEY, BASE_URL } from "../../Axios/requests";
import { truncate } from "../../Utils/truncate";

function Details({ itemDetails, handleClose }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const trailerBox = useRef(null);

  useEffect(() => {
    setTrailerUrl("");
    setLoading(false);
  }, [itemDetails]);

  const handleClick = () => {
    if (trailerUrl) {
      setTrailerUrl("");
      setLoading(false);
    } else {
      async function fetchTrailer() {
        setLoading(true);
        await axios
          .get(
            `/movie/${itemDetails?.id}/videos?api_key=${API_KEY}&language=en-US`
          )
          .then((responseMovieTrailer) => {
            if (
              responseMovieTrailer.data?.results?.length === 0 ||
              !responseMovieTrailer.data?.results[0]?.key ||
              itemDetails?.media_type === "tv"
            ) {
              throw new Error("Trailer not available!");
            } else {
              setTrailerUrl(responseMovieTrailer.data.results[0].key);
              trailerBox.current.focus();
            }
          })
          .catch(() => {
            axios
              .get(
                `/tv/${itemDetails?.id}/videos?api_key=${API_KEY}&language=en-US`
              )
              .then((responseTvTrailer) => {
                if (
                  responseTvTrailer.data?.results?.length === 0 ||
                  !responseTvTrailer.data?.results[0]?.key
                ) {
                  setLoading(false);
                  alert(
                    "Trailer not available.\nTry:\n1.Checking the connection.\n2.Playing different TV, Movie trailer."
                  );
                } else {
                  setTrailerUrl(responseTvTrailer.data.results[0].key);
                  trailerBox.current.focus();
                }
              })
              .catch(() => {
                setLoading(false);
                alert(
                  "Trailer not available.\nTry:\n1.Checking the connection.\n2.Playing different TV, Movie trailer."
                );
              });
          });
      }
      fetchTrailer();
    }
  };

  const opts = {
    height: "600",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="details">
      <div className="details__box">
        <div className="details__close" onClick={handleClose}>
          <Close />
        </div>
        <div className="details__content">
          <h1 className="details__heading">
            {itemDetails?.title ||
              itemDetails?.name ||
              itemDetails?.original_title}
          </h1>
          <h5>
            <span className="details__rating">
              {itemDetails?.vote_average ? itemDetails?.vote_average * 10 : 0}
              %&nbsp;Match
            </span>
            <span>
              {itemDetails?.first_air_date?.substr(0, 4) ||
                itemDetails?.release_date?.substr(0, 4)}
            </span>
            {itemDetails?.media_type ? (
              <span>{itemDetails?.media_type}</span>
            ) : (
              ""
            )}
            <span className="details__resolution">4K</span>
            <span className="details__lan">
              {itemDetails?.original_language}
            </span>
          </h5>
          <p className="details__description">
            {truncate(itemDetails?.overview, 320)}
          </p>
          <div className="details__buttons">
            <button
              className="details__button details__playTrailer"
              onClick={handleClick}
            >
              <span className="button__text">
                {!trailerUrl ? <PlayArrow /> : <Close />}
                &nbsp;{!trailerUrl ? "Play" : "Close"}
              </span>
            </button>
            <button
              className="details__button details__buttonGhost"
              onClick={() => {
                alert(
                  "Not added this functionality.\nPress Play button to play Trailer"
                );
              }}
            >
              <span className="button__text">
                <Add />
                &nbsp;My List
              </span>
            </button>
          </div>
        </div>
        <div
          className="details__img"
          style={
            itemDetails
              ? {
                  backgroundImage: `linear-gradient(
              90deg,
              rgba(0, 0, 0, 1),
              rgba(0, 0, 0, 0.4)),
              url("${BASE_URL}${
                    itemDetails?.backdrop_path
                      ? itemDetails?.backdrop_path
                      : itemDetails?.poster_path
                  }")`,
                }
              : {}
          }
        ></div>
      </div>
      <div
        className={`trailerBox ${loading ? "details__videoContainer" : ""}`}
        tabIndex="-1"
        ref={trailerBox}
      >
        {loading && (
          <Loading
            LoaderType="Puff"
            addStyle={{
              position: "absolute",
              top: "0",
              right: "0",
              bottom: "0",
              left: "0",
            }}
          />
        )}

        {trailerUrl && (
          <YouTube
            videoId={trailerUrl}
            opts={opts}
            onReady={(e) => {
              setLoading(false);
              e.target.playVideo();
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Details;
