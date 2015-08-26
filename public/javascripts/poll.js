// DOM Ready
$(document).ready(function() {
    //pull up percentages for poll
    $('#current-poll').click(
      resultsPoll();
    );
    //create poll
    $('#new-poll').click(
      createPoll();
    );
    //delete poll
    $('#delete-poll').click(
      deletePoll();
    );
    
});

//fill in current poll
function populatePoll() {
  var pollContent = '';

  //AJAX call for JSON from db
  $.getJSON('polls/poll', function(data){
    //question
    //options
    //add to html
  }).done(function(data){
    //add next poll at random
    getNextPoll();
  }).fail(fucntion(){
    //TODO add sorry message
  });
}

//FUNCTIONS

function resultsPoll() {
}

function createPoll(){
}

function deletePoll(){
}

function getNextPoll(){
  //TODO: randomize
  //TODO: no poll next
}

