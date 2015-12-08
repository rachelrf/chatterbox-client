// YOUR CODE HERE:
var App = function(){
    this.server = 'https://api.parse.com/1/classes/chatterbox';
    // this.latestTime = "0";
}

//https://api.parse.com/1/classes/chatterbox

  App.prototype = Object.create(Object.prototype);
  var latestTime = "0";
  // var app = new App();
  // app.init();



  App.prototype.init = function(){
    // $(".username").on('click', function() {
    //   this.addFriend();
    // });]
    console.log(this);
    this.fetch();
    var app = this;
    setInterval(function(){
      app.fetch();
    }, 5000);

    $('#sendButton').on('click', function() {
      var chatBoxVal = $('#chatBox').val();
      var roomVal = $('#chatRoom').val() || $('#roomSelect').val();
      var roomClass = "." + roomVal.replace(/()\s/g, '');
      if ($(roomClass).length === 0) {
        $('#roomSelect').append("<option value='" + roomVal + "'>" + roomVal + "</option>");
      }
      $('#roomSelect').val(roomVal);
      app.send(chatBoxVal, roomVal);
    });
  };

  App.prototype.clearMessages = function() {
    $('#chats').children().remove();
  }

  App.prototype.addMessage = function(message){
    
    var newDiv = "<div>" + message + "</div>";
    $('#chats').append(newDiv);
  }

  App.prototype.addRoom = function(room){
    var newRoom = '<div id="' + room + '">' + room + '</div>';
    $('#roomSelect').append(newRoom);

  }

  App.prototype.addFriend = function() {

  }

  App.prototype.send = function(text, room) {

    var message = {
      username: "HotSinglesNearYou!",
      roomname: room,
      text: text
    }

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),

      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message Sent');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  }

  App.prototype.fetch = function(){

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      //data: JSON.stringify(message),

      contentType: 'application/json',
      success: this.handleMessages,
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  }

  var escapeHtml = function(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };


  var buildMessage = function(username, text, roomname) {
    var newMessage = "@" + username + ": " + text;
    var newDiv = '<div class=' + roomname + '>' + newMessage + "</div>";
    $('#chats').prepend(newDiv);

  }

  App.prototype.handleMessages = function (data) {
    // console.log('chatterbox: Message Received');
    var results = data.results;
    // console.log(results);
    if(results[0].createdAt < latestTime){
      return;
    }
    //data-->results[]-->Object-->opponents-->username&text
    // var app = this;
    for(var i = 0; i < results.length; i++){
      var item = results[i];
      if (item.username && item.text) {
        var username = escapeHtml(item.username);
        var text = escapeHtml(item.text); 
        var roomname = escapeHtml(item.roomname);
        var createdAt = escapeHtml(item.createdAt);
      
        if (roomname) {
          var roomClass = "." + roomname.replace(/()\s/g, '');
          if ($(roomClass).length === 0) {
            $('#roomSelect').append("<option value='" + roomClass + "'>" + roomname + "</option>");
          }
        }

        if(createdAt > latestTime){ 
          buildMessage(username, text, roomClass.slice(1));
        }
      }
    }
    latestTime = results[0].createdAt;
  }

$(document).ready(function(){
  var app = new App();
  app.init();
});


// sendMessage('We found pictures of you online. Check out this site: www.snapchatleaks.com/xxx.jpg');
// getMessages();




