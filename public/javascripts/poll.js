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
        console.log(response);
        //populatePoll();
    }).fail(function(){
        //TODO switch message
        alert('Sorry, we couldn\'t submit your vote at this time.');
    });
    
    //create new poll
    $('#new-poll').click(function(){
      createPoll();
    });
    //delete poll
    $('#delete-poll').click(function(){
      deletePoll();
    });
  });

  //FUNCTIONS
  function resultsPoll() {
    var pollContent = '';
    //AJAX call for JSON from db
    $.getJSON('polls/poll', function(data){
      //questions
      ////options
      //add to html
    }).done(function(data){
      //add next poll at random
      //getNextPoll();
    }).fail(function(){
      //TODO add sorry message
    });
  }

  function createPoll(){
  }

  function deletePoll(){
  }

  function getNextPoll(){
    //TODO: randomize
    //TODO: no poll next
  }
});

