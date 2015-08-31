// DOM Ready
$(document).ready(function() {
  //add vote
  $('#pollVote').click(function(){
 
    var pollVote = {
      vote : $('input[name=poll]').val(),
      poll_id : $('div[name=votepoll]').attr('id'),
    }

    $.ajax({
      type : 'POST',
      data : JSON.stringify(pollVote),
      contentType: 'application/json; charset=utf-8',
      dataType : 'json',
      url : 'polls/vote'   
    }).done(function(response){
      //populatePoll();
    }).fail(function(){
      //TODO switch message
      alert('Sorry, we couldn\'t submit your vote at this time.');
    });
    
  });

  $('#createPoll').click(function(){
    //create new poll
    var newPoll = {
      "answer1" : $('input[name=answer1]').val(), 
      "answer2" : $('input[name=answer2]').val()
    } 

    $.ajax({
      type : 'POST',
      data : JSON.stringify(newPoll),
      contentType: 'application/json; charset=utf-8',
      //dataType : 'json',
      url : 'polls/create' 
    }).done(function(res){
      //validation errors
      if (res.error){
        if ($('#errors').length){
          $('#errors').empty();
        }
        for (var i = 0; i < res.errors.length; i++){
          $('#errors').append('<p>' + res.errors[i].msg + '</p>');
        }
      }
      //TODO add message about poll created
    }).fail(function(){
      alert('Sorry, we couldn\'t create your poll.');
    });
  });

  $('#next-poll').click(
    $.ajax('polls/getPoll', function(data){
        type : 'POST', 
        data : JSON.stringify({ id : $('div[name=votepoll]').attr('id')}),
        contentType : 'application/json; charset=utf-8',
        url : 'polls/getPoll'
    });
  );  
});

