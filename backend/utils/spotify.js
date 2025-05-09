// utils/spotify.js or just spotify.js
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

let accessToken = null;
let tokenExpiry = 0;

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const tokenRes = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({ grant_type: "client_credentials" }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  accessToken = tokenRes.data.access_token;
  tokenExpiry = Date.now() + tokenRes.data.expires_in * 1000 - 5000;
  return accessToken;
}

async function searchSpotify(query) {
  const token = await getAccessToken();
  const res = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: "track",
      limit: 5,
    },
  });

  return res.data.tracks.items.map((track) => ({
    name: track.name,
    artist: track.artists.map((a) => a.name).join(", "),
    embedUrl: `https://open.spotify.com/embed/track/${track.id}`,
  }));
}

module.exports = { searchSpotify };
