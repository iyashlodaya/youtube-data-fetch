const oAuth2Credentials = require("../credentials.json");
const xlsx = require("xlsx");
const Playlist = require("../models/playlist");
const SheetData = require("../models/sheetdata");
const google = require("googleapis").google;
const Video = require("../models/video");

// Handle authentication
const CLIENT_ID = oAuth2Credentials.web.client_id;
const CLIENT_SECRET = oAuth2Credentials.web.client_secret;
const REDIRECT_URL = oAuth2Credentials.web.redirect_uris[0];
const PLAYLIST_ID = "PLmGElG-9wxc9Us6IK6Qy-KHlG_F3IS6Q9";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
let scopes = "https://www.googleapis.com/auth/youtube.readonly";
let authenticated = false;

exports.authorize = (req, res) => {
  
  if (!authenticated) {
    //   generate Auth URL
    console.log("not authenticated");
    var authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    res.render("index", { url: authUrl });
  } else {
    
    var service = google.youtube("v3");
    service.playlists.list(
      {
        auth: oAuth2Client,
        id: PLAYLIST_ID,
        part: ["snippet", "contentDetails"],
      },
      (error, response) => {
        if (error) {
          res.json({ error: `Error Found in Playlist: ${error}` });
        }

        var playlistTitle = response.data.items[0].snippet.title;
        var playlistDescription = response.data.items[0].snippet.description;
        var playlistThumbnail =
          response.data.items[0].snippet.thumbnails.high.url;
        var noOfVideos = response.data.items[0].contentDetails.itemCount;

        var playlist = new Playlist({
          id: PLAYLIST_ID,
          playlistTitle: playlistTitle,
          playlistDescription: playlistDescription,
          playlistThumbnail: playlistThumbnail,
          videoCount: noOfVideos,
        });
        // save playlist
        playlist.save((error, plist) => {
          if (error) {
            console.log(error);
          }
          console.log("SAVED SUCCESFULLY");
        });

        service.playlistItems.list(
          {
            part: ["snippet", "contentDetails"],
            auth: oAuth2Client,
            playlistId: PLAYLIST_ID,
            maxResults: 50,
          },
          (error, pItems) => {
            if (error) {
              console.log("ERROR OCCURED :->" + error);
            }

            pItems.data.items.forEach((item, index = 0) => {
              var videoDuration;
              service.videos.list(
                {
                  part: ["contentDetails", "snippet"],
                  auth: oAuth2Client,
                  id: item.contentDetails.videoId,
                },
                (error, duration) => {
                  if (error) {
                    console.log("Error in Video!" + error);
                  } else {
                    duration.data.items.forEach((dur) => {
                      videoDuration = dur.contentDetails.duration.split(
                        "PT"
                      )[1];

                      const video = new Video({
                        videoId: item.contentDetails.videoId,
                        videoTitle: item.snippet.title,
                        videoDiscription: item.snippet.description,
                        videoThumbnail: item.snippet.thumbnails.high.url,
                        videoUrl: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
                        videoDuration: videoDuration,
                      });

                      video.save((error, videoResponse) => {
                        if (error) {
                          console.log("Error Detected" + error);
                        }

                        console.log(
                          "Success Saving the Video!!",
                          videoResponse.videoId
                        );
                      });
                    });
                  }
                }
              );
            });
          }
        );
      }
    );
  }
};

// callback
exports.callback = (req, res) => {
  const code = req.query.code;
  if (code) {
    oAuth2Client.getToken(code, (error, tokens) => {
      if (error) {
        console.log("ERROR FOUND!!", err);
      } else {
        console.log("Successfully Authenticated");
        oAuth2Client.setCredentials(tokens);
        authenticated = true;
        res.redirect("/");
      }
    });
  }
};

exports.saveExcelSheet = (req, res) => {
  const wb = xlsx.readFile("data.xlsx");
  const ws = wb.Sheets["Sheet1"];
  const data = xlsx.utils.sheet_to_json(ws);
  data.forEach((item) => {
    console.log(item);
    var sheet = new SheetData(item);
    sheet.save((err, resp) => {
      if (err) {
        console.log("Error in saving sheet data to DB!");
      }
      res.json({resp});

    });
    

  });
};
