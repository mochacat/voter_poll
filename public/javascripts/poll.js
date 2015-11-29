// DOM Ready
$(document).ready(function() {

   $('.container').on('click', '.list-group-item', function(){
     $('.list-group-item').removeClass('active');
     $(this).addClass('active');
    
     $('.poll input:radio').removeAttr('checked');
     $(this).children('input:radio').attr('checked', 'checked');
   });

  //ADD VOTE

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
    }).success(function(response){
      if (response.voted == true){
        var poll_vote = '<div class="alert alert-info" role="alert-danger">You already voted.</div>';
        $('#newPoll').closest('p').after(poll_vote);
      }
      populatePoll(response);
    }).fail(function(){
      var poll_fail = '<div class="alert alert-success" role="alert-danger">Sorry! Something went bad.</div>';
      $('#newPoll').closest('p').after(poll_fail);
    });
    
  });

  // POLL CREATION

  $('.container').on('click', '#newPoll', function(){
    $('#create').modal('show');
  });

  $('.container').on('click', '#createPoll', function(){
    $('.alert-success').remove();
    
    //create new poll
    var newPoll = {
      "answer1" : encodeHTML($('input[name=answer1]').val()), 
      "answer2" : encodeHTML($('input[name=answer2]').val())
    } 

    function encodeHTML(val){
        return val.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    $.ajax({
      type : 'POST',
      data : JSON.stringify(newPoll),
      contentType: 'application/json; charset=utf-8',
      //dataType : 'json',
      url : 'polls/create' 
    }).done(function(res){
      $('.modal-body').removeClass('has-error');

      //validation errors
      if (res.error){
        $('.modal-body').addClass('has-error');
        if ($('.error').length){
          $('.error').remove();
        }
        for (var i = 0; i < res.errors.length; i++){
          var input = res.errors[i].param;
          $('.modal-body > input[name='+input+']').before('<div class="error">' + res.errors[i].msg + '</div>');
        }
      } else {
        $('#create').modal('hide');
        var poll_success = '<div class="alert alert-success" role="alert">Thanks for your submission!</div>';
        $('#newPoll').closest('p').after(poll_success);
      }
    }).fail(function(){
      var poll_fail = '<div class="alert alert-danger" role="alert-danger">Sorry! Something went bad.</div>';
      $('#newPoll').closest('p').after(poll_fail); 
    });
  });

  // NEXT POLL
  $('.container').on('click', '#nextPoll', function(){
    $('.alert').remove();
    
    var currentPoll = {
      id : $('div[name=votepoll]').attr('id')
    }

    $.ajax({
      type : 'POST', 
      data : JSON.stringify(currentPoll),
      contentType : 'application/json; charset=utf-8',
      url : 'polls/getPoll'
    }).success(function(res){
      if (res.last == false){
        //remove old chart
        $('donut_single').remove();

        //remove old poll id
        $('div[name=votepoll]').empty();
        $('div[name=votepoll]').attr('id', res.poll_id);

        //create new poll html
        var new_poll = '<ul class="list-group">';
       
        for (var i = 0; i < res.answers.length; i++){
          new_poll += '<li class="list-group-item">';
          new_poll += '<input class="answer" name="poll" type="radio" value="' + res.answers[i].answer + '">';
          new_poll += res.answers[i].answer + '</li>';
        }
        new_poll += '</ul>';
        new_poll += '<p><button type="submit" id="pollVote" class="btn btn-lg btn-success btn-block">Submit</button>';
        new_poll += '<button type="submit" id="nextPoll" class="btn btn-lg btn-success btn-block">Next</button>';
        new_poll += '<button type="submit" id="newPoll" class="btn btn-lg btn-success btn-block">';
        new_poll += '<span class="glyphicon glyphicon-pencil"></span></button></p>';
        $('div[name=votepoll]').append(new_poll);
      } else {
        var poll_last = '<div class="alert alert-info" role="alert-danger">That\'s all we got, you\'ve reached the last poll.</div>';
        $('#newPoll').closest('p').after(poll_last);
      }
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

    var chart_data = '<div class="animated fadeInDown" id="donut_single" style="height:550px; width:550px"></div>';
    
    //insert chart
    $('.poll').before(chart_data);

    var chart = new google.visualization.PieChart(document.getElementById('donut_single'));
    chart.draw(data, options);
  }

});

