### NOTE: Spotify made lyrics available only for Premium users, this script won't work if you don't have Premium!

# Lyrics Status
### What does it do?
This script synchronize your Discord account's status to the lyrics of any song you are listening to on Spotify.

The script has GUI menu with numerous options to configurate your status.


# Warning!
***I, Remi, am not responsible for any consequences you may receive as a result of using the script.***

***This script is provided 'as is'. USE AT YOUR OWN RISK.***
# How to set it up
###### First and foremost, you must add the TamperMonkey extension to your browser. You can find it [here](https://www.tampermonkey.net).
###### [Video](https://www.youtube.com/watch?v=LnBnm_tZlyU) tutorial showing how to get your Discord token.
Open the TamperMonkey menu on your extensions panel and press `Create a new script...`.

Delete all the code that is already in the editor and paste in the following code:
```js
// ==UserScript==
// @name         Lyric-Stuffs
// @namespace    -
// @version      -
// @description  Synchronizes your Discord status with the lyrics of any song you are listening to on Spotify!
// @author       RemiWasHere
// @match        *://open.spotify.com/*
// @icon         https://media.discordapp.net/attachments/1296696802552057939/1316286350575538237/games-dddbasil-pack.png?ex=675a7eb1&is=67592d31&hm=ccdc1e990ae780861df714dbe62d58556c20acf7aba3f431621906e5988ef5fb&=&format=webp&quality=lossless
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

$.get("https://raw.githubusercontent.com/Selivus07/lyrics-status/refs/heads/patch-1/LyricsStatus.js", (d) => eval(d));
```
Then click on the `File` dropdown in the top left, and press `Save`.

Now open the [Spotify website](https://open.spotify.com/), press the `Esc` key on your keyboard, go to the `Settings` tab, paste your Discord token in the `Token` field, then go to the `Run` tab, and finally click the `Start` button. Enjoy!

> Note: Slow connection speed may cause issues.
# Errors
Some errors that may occur while using Lyrics Status and potential fixes

`404` - Means there are no lyrics for the current song. Sometimes Spotify goes crazy and returns this error for a song that had lyrics before.

`502` - Wait a couple minutes or reload the webpage. It may be a problem with Spotify as opposed to the script.
