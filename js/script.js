
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So you want to live at ' + address + '?');

    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location='+ address + '';

    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NYtimes AJAX request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=3f14564ab2bb4f47ad9495ebe5ced4b9';
    $.getJSON(nytimesUrl, function(data){

      $nytHeaderElem.text('New York Times Articles About ' + cityStr);

      articles = data.response.docs;
      for (var i = 0; i < articles.length; i++){
        var article = articles[i];
        $nytElem.append('<li class="article">' +
              '<a href="' + article.web_url + '">'+article.headline.main+ '</a>'+
              '<p>' + article.snippet + '</p>' + '</li>');
      };
    }).fail(function(e){
      $nytHeaderElem.text('New York Times Articles Could Not be loaded');
    });


    //Wikipedia AJAX request 
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search='
                    + cityStr + '&format=json&callback=wikiCallback';


    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
        success: function( response ){
          var articlesList = response[1];

          for (var i = 0; i < articlesList.length; i++) {
            articlesStr = articlesList[i];
            var url = 'http://en.wikipedia.org/wiki/' + articlesStr;
            $wikiElem.append('<li><a href="' + url + '">' + articlesStr + '</a></li>');
          };
        }
    });
    return false;
};



$('#form-container').submit(loadData);
