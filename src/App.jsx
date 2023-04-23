import React, { useState } from "react";
import { getSpotifyAccessToken, searchSong, getRecommendedSongsFromSpotify } from "./utils/spotify";
import './App.css'






function App() {
  // dotenv.config();
  const [artist1, setArtist1] = useState("");
  const [artist2, setArtist2] = useState("");
  const [artist3, setArtist3] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerateSongs() {
    setLoading(true);
    if(artist1==="" || artist2==="",artist3===""){
      alert("Atleast 3 Artists Name Required")
    }
    const accessToken = await getSpotifyAccessToken();

    const artist1Tracks = await searchArtistTracks(accessToken, artist1);
    const artist2Tracks = await searchArtistTracks(accessToken, artist2);
    const artist3Tracks = await searchArtistTracks(accessToken, artist3);

    const allTracks = [artist1Tracks[0], artist2Tracks[0], artist3Tracks[0]];
    const trackIds = allTracks.map((track) => track.id);

    const recommendedTracks = [];

      const recommendedSongs = await getRecommendedSongsFromSpotify(accessToken, trackIds);
      recommendedTracks.push( {songs: recommendedSongs.slice(0,5)} );
    

    setRecommendations(recommendedTracks);
    setLoading(false);


   
  }

  async function searchArtistTracks(accessToken, artistName) {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data)
    const artistId = data.artists.items?.[0].id || null;
    console.log("artistId :",artistId,"  ------name :",artistName);

    if (!artistId) {
      return [];
    }

    const tracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const tracksData = await tracksResponse.json();
    return tracksData.tracks;
  }

  return (
    <div className="form">
      <div >
        <label className="label">Enter artist 1:</label>
        <input type="text" value={artist1} onChange={(e) => setArtist1(e.target.value)} className="input" />
      </div>
      <div>
        <label className="label">Enter artist 2:</label>
        <input type="text" value={artist2} onChange={(e) => setArtist2(e.target.value)} className="input" />
      </div>
      <div>
        <label className="label">Enter artist 3:</label>
        <input type="text" value={artist3} onChange={(e) => setArtist3(e.target.value)} className="input" />
      </div>
      <button onClick={handleGenerateSongs} className="btn">Generate Songs</button>
      {recommendations.map((recommendation, index) => (
        <div key={index}>
          <h2 className="h2">Recommended Songs</h2>
          <hr/>
        {
     
           loading ? <h2>Loading...</h2> :  <ul className="ul">
           {recommendation.songs.map((song) => (
             <li key={song.id} className="li"> 
               {song.name} -{" "}
               <a href={song.external_urls.spotify} target="_blank" rel="noreferrer" className="link">
                 Listen on Spotify
               </a>
             </li>
           ))}
         </ul>
          
        }
        </div>
        
      ))}
      <hr/>
    </div>
  );
}

export default App;
