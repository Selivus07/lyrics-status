var playbackStateUpdater = null,
    statusChanger = null,
    stopped = true,
    accessToken = null;



// UI //

const menuUI = $("<div/>", {
          id: "menuUI",
          class: "hidden",
      }).css({
          width: "200px",
          height: "200px",
          backgroundColor: "rgba(100, 100, 100, 0.7)",
          left: "100%",
          top: "55%",
          transform: "translate(-100%, -50%)",
          position: "fixed",
          zIndex: "9999"
      }),
      logWindow = $("<div/>", {
          id: "logWindow"
      }).css({
          width: "180px",
          height: "100px",
          overflow: "hidden auto",
          margin: "5px 0 0 10px",
          border: "1px solid rgba(50, 50, 50, 0.6)",
          borderRadius: "2px",
          backgroundColor: "rgba(110, 110, 110, 0.6)",
          fontSize: "12px"
      }).appendTo(menuUI),
      startButton = $("<button/>", {
          id: "startButton",
          class: "btn"
      }).html("Start").css({
          borderColor: "rgba(0, 193, 19, 0.6)",
          backgroundColor: "rgba(0, 173, 17, 0.6)",
          marginRight: "2.5px",
          left: "calc(50% - 2.5px)"
      }).appendTo(menuUI),
      stopButton = $("<button/>", {
          id: "stopButton",
          class: "btn"
      }).html("Stop").css({
          borderColor: "rgba(193, 0, 19, 0.6)",
          backgroundColor: "rgba(173, 0, 17, 0.6)",
          left: "50%"
      }).appendTo(menuUI),
      tokenInput = $("<input/>", {
          id: "tokenInput",
          name: "token",
          placeholder: "Paste your Discord token here..."
      }).css({
          width: "180px",
          margin: "5px 0 0 10px",
          border: "none",
          borderRadius: "2px",
          backgroundColor: "rgba(110, 110, 110, 0.6)"
      }).appendTo(menuUI),
      style = $("<style/>").html(`
      .btn {
          position: relative;
          width: auto;
          min-height: 20px;
          border-radius: 5px;
          border: 2px solid rgba(255, 255, 255, 0.6);
          background-color: rgba(184, 193, 180, 0.6);
          transition: border 0.2s, background-color 0.2s;
      }
      .btn:hover {
          border: 2px solid rgba(184, 193, 180, 0.6);
          background-color: rgba(255, 255, 255, 0.6);
      }
      .btn:active {
          border: 2px solid rgba(125, 130, 125, 0.6);
          background-color: rgba(200, 200, 200, 0.6);
      }
      #startButton:hover {
          border-color: rgba(0, 173, 17, 0.6) !important;
          background-color: rgba(0, 193, 19, 0.6) !important;
      }
      #startButton:active {
          border-color: rgba(0, 143, 14, 0.6) !important;
          background-color: rgba(0, 163, 16, 0.6) !important;
      }
      #stopButton:hover {
          border-color: rgba(173, 0, 17, 0.6) !important;
          background-color: rgba(193, 0, 19, 0.6) !important;
      }
      #stopButton:active {
          border-color: rgba(143, 0, 14, 0.6) !important;
          background-color: rgba(163, 0, 16, 0.6) !important;
      }
      #startButton:disabled {
          border-color: rgba(0, 150, 19, 0.6) !important;
          background-color: rgba(0, 133, 17, 0.6) !important;
      }
      #stopButton:disabled {
          border-color: rgba(150, 0, 19, 0.6) !important;
          background-color: rgba(133, 0, 17, 0.6) !important;
      }
      #startButton, #stopButton {
          transform: translate(-100%, 0);
      }
      #menuUI button {
          cursor: pointer;
      }
      #logWindow span {
          margin: 1px 0 0 2px;
          float: left;
      }
      .error {
          color: rgba(234, 0, 0, 0.6);
      }
      .warning {
          color: rgba(255, 182, 0.6);
      }
      .log {
          color: rgba(150, 150, 200, 0.6);
      }
      #tokenInput::placeholder {
          font-size: 12px;
      }
      `).appendTo(document.body);

// UI //



// Events //

$(document).keyup(function(e) {
    switch (e.key) {
        case "Escape": $(menuUI).toggleClass("hidden");
            break;
    }
});

$(startButton).click(()=>{if(!stopped){return;}stopped=false;init()});
$(stopButton).click(()=>{if(stopped){return;}stop()});

// Events //



// Lyrics' sender code goes here //

$(tokenInput).val(localStorage.getItem("discordToken") ?? "");
// If exists, restore the previous Discord token we've had

function addLog(text, t) {
    let type = t == "error" ? "Error" : t == "warning" ? "Warning" : "Log";
    $("<span/>", { class: type.toLowerCase() }).html(`[${type}]: ${text}`).appendTo(logWindow)[0].scrollIntoView(false);
}

function formatSeconds(s){return(s-(s%=60))/60+(9<s?':':':0')+s}

async function refreshAccessToken() {
    let response = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=web_player", { credentials: "same-origin" });
    let json = await response.json();
    accessToken = json.accessToken;
}

function changeStatus(text, emojiID, emojiName) {
    const start = Date.now();
        const token = $(tokenInput).val();

        var xhr = new XMLHttpRequest();
        xhr.open("PATCH", "https://discordapp.com/api/v8/users/@me/settings");

        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", token);

        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {

                if(xhr.status === 401) {
                    addLog("You provided invalid token!", "error");
                    return stop();
                }
                // If invalid token provided

            }
        };

        xhr.send(JSON.stringify({
				  "custom_status": {
				    "text": text,
					  "emoji_id": emojiID,
					  "emoji_name": emojiName,
            "expires_at": null
				  }
        }));
}

function init() {
    var lyrics = [],
        lastTrackId = null,
        trackProgressMs = 0,
        trackDurationMs = 0,
        currentLyric = "";

    addLog("Lyrics sender started...");

    localStorage.setItem("discordToken", $(tokenInput).val());

    playbackStateUpdater = setInterval(function() {
        let getPlaybackState = new XMLHttpRequest();

        getPlaybackState.open("GET", "https://api.spotify.com/v1/me/player");

        getPlaybackState.setRequestHeader("Content-Type", "application/json");
        getPlaybackState.setRequestHeader("Authorization", `Bearer ${accessToken}`);

        getPlaybackState.onreadystatechange = async function() {
            if(getPlaybackState.readyState === 4) {

                switch(getPlaybackState.status) {
                    case 204:
                        addLog("You\'re not listening music!", "error");
                        return stop();
                        break;
                    case 401:
                        await refreshAccessToken();
                        addLog("Refreshed access token due to expired previous one. <strong>Keep working...</strong>", "warning");
                        return;
                        break;
                    case 502:
                        addLog("Got 502 error, might be problem with Spotify itself. If it continues for a time, try refreshing the page or wait few minutes.", "error");
                        return;
                        break;
                }

                let response = JSON.parse(getPlaybackState.response);

                if(lastTrackId !== response.item.id) {
                    trackDurationMs = response.item.duration_ms;

                    lyrics = [];

                    let lyricsResponse = await fetch(
                        "https://spclient.wg.spotify.com/lyrics/v1/track/" + response.item.id, {
                            "headers": {
                                "Authorization": `Bearer ${accessToken}`
                            },
                            "method": "GET"
                        }
                    );
                    // Used fetch because of less code size

                    if(lyricsResponse.status === 404) {
                        addLog("Spotify doesn\"t have lyrics for this song.", "warning");
                        return stop();
                    }
                    // If Spotify doesn't have lyrics

                    let lyricsJson = await lyricsResponse.json();

                    for (let line of lyricsJson?.lines) {
                        lyrics.push({
                            time: line?.time,
                            words: line?.words[0]?.string,
                        });
                    }
                }

                trackProgressMs = response.progress_ms;
            }
        }

        getPlaybackState.send();
    }, 1000);
    statusChanger = setInterval(function() {

        if(trackDurationMs === 0 || trackProgressMs >= trackDurationMs) return;
        // If song is ended or data not fetched yet, wait until new (or the same) song will start

        trackProgressMs += 150;

        for (let i = 0; i < lyrics.length; i++) {

            let lyric = lyrics[i];
            let nextLyric = lyrics[i + 1];


            if(lyric.time < (trackProgressMs + 500)) {

                if(!nextLyric) {

                    if(trackDurationMs - (trackProgressMs + 500) < 1150) {

                        if(currentLyric === "|End|") break;

                        currentLyric = "|End|";


                        changeStatus(`[${formatSeconds((trackProgressMs / 1000).toFixed(0))}] Song lyrics - |End|`);


                        break;

                    } else {

                        if(!lyric.words) lyric.words = lyrics[i - 1].words;
                        // Happens time to time

                        if(lyric.words === currentLyric) break;

                        currentLyric = lyric.words;


                        changeStatus(`[${formatSeconds((trackProgressMs / 1000).toFixed(0))}] Song lyrics - ${lyric.words}`);


                        break;

                    }

                }

                if(nextLyric.time < (trackProgressMs + 500)) continue;
                if(lyric.words === currentLyric) continue;

                currentLyric = lyric.words;


                changeStatus(`[${formatSeconds((trackProgressMs / 1000).toFixed(0))}] Song lyrics - ${!currentLyric ? "|End|" : currentLyric}`);


                break;

            } else {

                break;

            }


        }

    }, 150);
}

function stop() {
    clearInterval(playbackStateUpdater);
    clearInterval(statusChanger);
    stopped = true;
    addLog("Lyrics sender stopped...");
}

// Lyrics' sender code goes here //


$(menuUI).appendTo(document.body);
