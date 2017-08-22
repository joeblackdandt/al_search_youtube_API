// The client ID is obtained from the {{ Google Cloud Console }}
// at {{ https://cloud.google.com/console }}.
// If you run this code from a server other than http://localhost,
// you need to register your own client ID.
var OAUTH2_CLIENT_ID = '383268913726-h03oqdltctb0oubgjst42ud6kastnen6.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

// Upon loading, the Google APIs JS client automatically invokes this callback.
googleApiClientReady = function() {
  gapi.auth.init(function() {
    window.setTimeout(checkAuth, 1);
  });
}

// Attempt the immediate OAuth 2.0 client flow as soon as the page loads.
// If the currently logged-in Google Account has previously authorized
// the client specified as the OAUTH2_CLIENT_ID, then the authorization
// succeeds with no user intervention. Otherwise, it fails and the
// user interface that prompts for authorization needs to display.
function checkAuth() {
  gapi.auth.authorize({
    client_id: OAUTH2_CLIENT_ID,
    scope: OAUTH2_SCOPES,
    immediate: true
  }, handleAuthResult);
}

// Handle the result of a gapi.auth.authorize() call.
function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    // Authorization was successful. Hide authorization prompts and show
    // content that should be visible after authorization succeeds.
    $('.pre-auth').css('display','none');
    $('.post-auth').css('display','block');
    loadAPIClientInterfaces();
  } else {
    // Make the #login-link clickable. Attempt a non-immediate OAuth 2.0
    // client flow. The current function is called when that flow completes.
    document.querySelector('#login-link').addEventListener("click" , function() {
      gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: false
        }, handleAuthResult);
    });
  }
}

// Load the client interfaces for the YouTube Analytics and Data APIs, which
// are required to use the Google APIs JS client. More info is available at
// https://developers.google.com/api-client-library/javascript/dev/dev_jscript#loading-the-client-library-and-the-api
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
   
  });
}


// when everything is loaded
function handleAPILoaded(){
  document.querySelector('#s').removeAttribute('disabled')
}


// search action
function search() {
  var q = $('#s').val();
  var request = gapi.client.youtube.search.list({
    q: q,
    part: 'snippet',
    type: "video"
  });

  request.execute(function(response) {
    resetPlayer();
    
    var resultsItems = response.result.items.length;
    
    // clean the results before a new search
    $('#search-results-container').html('');
    
    for(var i=0;i<resultsItems;i++){
      var itemHTML = generateThumbnail(response.result.items[i]);
      $('#search-results-container').append(itemHTML);
    }
    
    // console.log(response.result);
  });
}


//listener to the enter key
document.querySelector('#s').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      search();
    }
});



// generates the HTML code for the thumbnails of the results
function generateThumbnail (item){
  var html = '';
  
  html += '<div class="media">';
  html += '  <div class="media-left">';
  html += '    <a href="https://www.youtube.com/watch?v='+ item.id.videoId + '" onclick="playVideoWithId(\''+ item.id.videoId + '\');">';
  html += '      <img class="media-object" src="'+ item.snippet.thumbnails.default.url + '">';
  html += '    </a>';
  html += '  </div>';
  html += '  <div class="media-body">';
  html += '    <h5 class="media-heading"><strong><a href="https://www.youtube.com/watch?v='+ item.id.videoId + '" onclick="playVideoWithId(\''+ item.id.videoId + '\');">'+ item.snippet.title + '</a></strong></h5>';
  html += '  </div>';
  html += '</div>';
  
  return html;
}


// play a video using its ID
function playVideoWithId(id){
  event.preventDefault();
  document.querySelector('#player').classList.remove('hidden');
  document.querySelector('.video-controls').classList.remove('hidden');
  player.loadVideoById(id, 5, "large");
  playVideo();
}


// player functions
function playVideo() {
  player.playVideo();
  
  document.querySelector('.play-button').classList.add('hidden');
  document.querySelector('.pause-button').classList.remove('hidden');
}
function pauseVideo() {
  player.pauseVideo();
  
  document.querySelector('.play-button').classList.remove('hidden');
  document.querySelector('.pause-button').classList.add('hidden');
}
function stopVideo() {
  player.stopVideo();
  
  document.querySelector('.play-button').classList.remove('hidden');
  document.querySelector('.pause-button').classList.add('hidden');
}
function resetPlayer(){
  stopVideo();
  document.querySelector('#player').classList.add('hidden');
  document.querySelector('.video-controls').classList.add('hidden');
}