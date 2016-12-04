$(function () {
    var apiURL = 'https://en.wikipedia.org/w/api.php?';
    var a;
    var offset = 3;
    var lastOffset = 0;

    function focusSearch() {
        $('.search-box').on('keypress', function (e) {
            var searchValue = $('.search-box').val();
            var key = e.which;
            $(this).css('{marginTop: 0}')
            console.log('Works!');
            if (searchValue !== '' && key == 13) {
                console.log(searchValue);
                $('.results').empty();
                a = undefined;
                lastOffset = 0;
                sendRequest(searchValue);
            }
        });
        $('.search-box').on('focusout', function () {
            if ($(this).val() == '') $('.results').empty();
        });
        $(".search-box").focus(function() { $(this).select(); } );
    }
    
    function clearContent () {
        $('.clear-input-button').on('click',function(){
            $('.results').empty();
            a = undefined;
            lastOffset = 0;
        });
    }
    var $result = $('<div class="response-box">');
    var numOfResults = 30;
    function sendRequest(searchValue) {
        return $.ajax({
            async: true
            , url: apiURL
            , dataType: 'jsonp'
            , data: {
                action: 'opensearch'
                , search: searchValue
                , limit: numOfResults
                , namespace: '0'
            }
            , xhrFields: {
                withCredentials: true
            }
        , }).done(response);
    }
    var response = function (data) {
        if (a == undefined) a = {
            data: data
        };
        var responseBox = $('.results');
        console.log(a.data[1]);
        for(var i=0;i<offset;i++){
            var j = i + lastOffset;
            if(a.data[1][j] == undefined) return;
            var content;
            var $link = $('<a></a>').attr('href', a.data[3][j]).addClass('external-content');
            var $result = $('<div></div>').addClass('col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3');
            if (a.data[1].length == 0) content = '<p>No results found!</p>';
            else content = '<p>' + a.data[1][j] + '</p><p>' + a.data[2][j] + '</p>';
            responseBox.append($link.append($result.html(content).addClass('content')));   
        }
        lastOffset += offset;
    }
    var loadMoreResults = function () {
        $(window).scroll(function () {
            console.log('$(window).scrollTop()',$(window).scrollTop());
            console.log('$(document).height()',$(document).height());
            console.log('$(window).height()',$(window).height());
            if ($(window).scrollTop()-200 === $(document).height() - $(window).height()-200) {
                response();
            }
        });
    }
    focusSearch();
    loadMoreResults();
    clearContent();
});