var generateImageButton = document.querySelector('#generate-image-button');

var loadTuneButton = document.querySelector('#load-tune-button');
var guardianButton = document.querySelector('#guardian-button');
var loading = document.querySelector(".loading");
var imageURL, imageDescription, imageTags, generateTune2, newURL, guardianNews, imageConfidence;

var generateImage = new XMLHttpRequest();

generateImage.onreadystatechange = function() {
  if (generateImage.readyState === 4 && generateImage.status == 200) {
    imageURL = JSON.parse(generateImage.response).urls.regular;
    updateImage(imageURL);
    getImageDescription(imageURL);
  }
}

generateImageButton.onclick = function() {
  generateImage.open('GET', "https://api.unsplash.com/photos/random?client_id=" + unsplashKey, true);
  showLoading();
  generateImage.send();
};

var describeImage = new XMLHttpRequest();

describeImage.onreadystatechange = function() {
  if (describeImage.readyState === 4 && describeImage.status == 200) {
    imageDescription = JSON.parse(describeImage.response).description.captions[0].text;
    imageConfidence = JSON.parse(describeImage.response).description.captions[0].confidence;
    console.log(imageConfidence)
    imageTags = JSON.parse(describeImage.response).description.tags;
    imageTags = (imageTags.length > 5 ? imageTags.slice(0,5) : imageTags);
    document.querySelector(".image-description").textContent = imageDescription;
    document.querySelector(".image-tags").textContent = imageTags.join(" ");
    updateDOM();
    hideLoading();
  }
}

var getImageDescription = function (url) {
  describeImage.open('POST', "https://api.projectoxford.ai/vision/v1.0/describe?maxCandidates=1");
  describeImage.setRequestHeader("Content-Type", "application/json");
  describeImage.setRequestHeader("Ocp-Apim-Subscription-Key", computerVisionKey);
  var body = JSON.stringify({url : url});
  describeImage.send(body);
}

var generateTune = new XMLHttpRequest();

// generateTune2 = new XMLHttpRequest();
// generateTune2.onreadystatechange = function () {
//   if (generateTune2.readyState === 4 && generateTune2.status == 200) {
//     var youtubeURL = JSON.parse(generateTune2.response).videos[0].uri;
//     var youtubeTitle = JSON.parse(generateTune2.response).videos[0].title;
//     document.querySelector(".youtube-link").innerHTML = '<a href="' + youtubeURL + '" target="_blank">' + youtubeTitle + '</a>';
//   }
// }

generateTune.onreadystatechange = function() {
  if (generateTune.readyState === 4 && generateTune.status == 200) {
    var songTitle = JSON.parse(generateTune.response).results[2].title;
    document.querySelector(".youtube-link").innerHTML = '<i class="fa fa-fw fa-music" aria-hidden="true"></i> ' + songTitle;
    //console.log(JSON.parse(generateTune.response).results[0].resource_url);
    // newURL = JSON.parse(generateTune.response).results[0].resource_url;
    // generateTune2.open('GET', newURL, true);
    // generateTune2.send();
  }
}

loadTuneButton.onclick = function() {
  console.log('button clicked')
  generateTune.open('GET', "https://api.discogs.com/database/search?release_title=" + imageTags[0] + "&key=" + discogsKey + "&secret=" + discogsSecret, true);
  generateTune.send();
};

var generateGuardian = new XMLHttpRequest();

guardianButton.onclick = function(){
  generateGuardian.open('get',"http://content.guardianapis.com/search?q="+imageTags[0]+"%20"+imageTags[1]+"%20"+imageTags[2]+"&api-key="+guardianKey);
  generateGuardian.send();
};

generateGuardian.onreadystatechange = function(){
  if (generateGuardian.readyState === 4 && generateGuardian.status === 200){
    guardianNews = JSON.parse(generateGuardian.response).response.results;
    createGuardianList();
  }
};

function createGuardianList(){
  var list = document.createElement('ul');
  for (var i = 0; i < (guardianNews.length < 3 ? guardianNews.length : 3); i++)
  {
    var listItem = document.createElement('li');
    listItem.classList.add("article-item");
    listItem.innerHTML = "<a href=" + guardianNews[i].webUrl + ">" + guardianNews[i].webTitle + "</a>";
    list.appendChild(listItem);
  }
  document.querySelector(".articles").appendChild(list);
}

function showLoading () {
  loading.style.display = 'block';
}

function hideLoading () {
  loading.style.display = 'none';
}

function updateImage () {
  document.querySelector('.image').src = imageURL;
}

function updateDOM () {
  document.querySelector('.image').src = imageURL;
  document.querySelector('.image').alt = imageDescription;
  var confidenceIcon = document.createElement('div');
  confidenceIcon.classList.add('confidence-icon');
  confidenceIcon.classList.add(imageConfidence < 0.4 ? 'red' : imageConfidence < 0.8 ? 'orange' : 'green');
  document.querySelector(".image-description").innerHTML = confidenceIcon.outerHTML + imageDescription;
}
