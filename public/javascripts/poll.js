// DOM Ready
$(document).ready(function() {

   $('.container').on('click', '.list-group-item', function(){
     $('.list-group-item').removeClass('active');
     $(this).addClass('active');
    
     $('.poll input:radio').removeAttr('checked');
     $(this).children('input:radio').attr('checked', 'checked');
   });

  //add vote
  $('.container').on('click', '#pollVote',function(){
    $('#donut_single').remove();
 
    var pollVote = {
        vote : $('input[name=poll]:checked').val(),
      poll_id : $('div[name=votepoll]').attr('id'),
    }

    $.ajax({
      type : 'POST',
      data : JSON.stringify(pollVote),
      contentType: 'application/json; charset=utf-8',
      dataType : 'json',
      url : 'polls/vote'   
    }).done(function(response){
      populatePoll(response);
    }).fail(function(){
      //TODO switch message
      alert('Sorry, we couldn\'t submit your vote at this time.');
    });
    
  });

  $('.container').on('click', '#createPoll', function(){
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
      } else {
        $('#create').modal('hide');
      }
      //TODO add message about poll created
    }).fail(function(){
      alert('Sorry, we couldn\'t create your poll.');
    });
  });

  var currentPoll = {
    id : $('div[name=votepoll]').attr('id')
  }

  $('.container').on('click', '#nextPoll', function(){
    $.ajax({
        type : 'POST', 
        data : JSON.stringify(currentPoll),
        contentType : 'application/json; charset=utf-8',
        url : 'polls/getPoll'
    }).success(function(res){
        $('donut_single').remove();
        $('div[name=votepoll]').empty();
        $('div[name=votepoll]').attr('id', res.poll_id);
        var new_poll = '<ul class="list-group">';
       
        for (var i = 0; i < res.answers.length; i++){
          new_poll += '<li class="list-group-item">';
          new_poll += '<input class="answer" name="poll" type="radio" value="' + res.answers[i].answer + '">';
          new_poll += res.answers[i].answer + '</li>';
        }
        new_poll += '</ul>';
        new_poll += '<p><button type="submit" id="pollVote" class="btn btn-lg btn-success btn-block">Submit</button>';
        new_poll += '<button type="submit" id="nextPoll" class="btn btn-lg btn-success btn-block">Next</button></p>';
        $('div[name=votepoll]').append(new_poll);
    });
  }); 

  function populatePoll(poll_data){
    if (poll_data.voted == true){
      //add voted message
    }

    var vote_data = poll_data.data[0].answers;
    google.setOnLoadCallback(drawChart(vote_data));
  }

  function drawChart(data){
    var data = google.visualization.arrayToDataTable([
      ['Effort', 'Amount given'],
      [data[0].answer, data[0].vote],
      [data[1].answer, data[1].vote] 
    ]);

    var options = {
      pieHole: 0.7,
      pieSliceTextStyle: {
        color: 'black',
      },
      legend: 'none'
    };

    var chart_data = '<div id="donut_single" style="height:550px; width:550px"></div>';

    //insert chart
    $('.poll').prepend(chart_data);

    var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
    chart.draw(data, options);
  }

});

