

var music = angular.module('music', []);

music.controller('musicHandler', function ($scope) {
    $scope.role = "musician";
    $scope.imageUrl = "server";
    $scope.fakeAlbum = {
    name: 'Abbey Road',
    imageUrl: 'http://fillmurray.com/300/300',
    songs: [{
        name: 'Romeo & Juliette',
        artists: [{name: 'Bill'}],
        genre: 'Funk',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
    }, {
        name: 'White Rabbit',
        artists: [{name: 'Bill'}, {name: 'Bob'}],
        genre: 'Fantasy',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
    }, {
        name: 'Lucy in the Sky with Diamonds',
        artists: [{name: 'Bob'}],
        genre: 'Space',
        audioUrl: 'https://learndotresources.s3.amazonaws.com/workshop/5616dbe5a561920300b10cd7/Dexter_Britain_-_03_-_The_Stars_Are_Out_Interlude.mp3'
    }]
    };
})


music.controller('songHandler', function ($http) {
  $http.get('/api/songs')
  .then(function (response) {
   console.log('the server responded with ', response);
  return response.data;
  }).then(function (body){
    console.log(body);
  }).catch(console.error.bind(console));
  });

music.controller('albumHandler', function ($http, $scope) {
  $http.get('/api/albums')
  .then(function (response) {
    return response.data[Math.floor(Math.random() * response.data.length)];
  })
  .then(function(album){
    $scope.Album = album;
    $scope.imageUrl = '/api/albums/' + $scope.Album.id + '/image';
    
    $http.get('/api/albums/' + $scope.Album.id + '/songs/' )
    .then(function (response) {
      return response.data;
    })
    .then(function(songs){
      $scope.songs = songs;
    })
     .catch(console.error.bind(console));
    }).catch(console.error.bind(console));


});

music.controller('playHandler', function($http, $scope, $rootScope){

   $scope.Album;

   $scope.start = function (song) {
        var audio = document.createElement('audio');
        console.log(song);
        audio.src = song.url;
        audio.load();
        audio.play();
        $scope.currentSong = song;
        $rootScope.showButton = true;
        
       
   };

   // music.controller('pauseHandler', function($http, $scope, $rootScope){

   // $scope.Album;

   // $scope.start = function (song) {
   //      var audio = document.createElement('audio');
   //      console.log(song);
   //      audio.src = song.url;
   //      audio.load();
   //      audio.play();
   //      $scope.currentSong = song;
   //      $rootScope.showButton = true;
       
   // };

   // $scope.stop = function(){
   //  audio.
   // } 
})














