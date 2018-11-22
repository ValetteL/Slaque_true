function searchUser(){
    $.ajax({
        url: $("#search-user").data("url"),
        data: {
            'search' : $("input.search-bar").val()
        },
        method: 'post'
    }).done(function (users) {
        console.log(users);
        let html = "";
        users.forEach(function (user) {
            //console.log(user.username);
            html += '<div class="chat_list" data-id="' + user.id + '">' +

                '<div class="chat_people">' +

                '<div class="chat_img"> <img src="/slaque/public/img/chat.jpg" alt="yo"> </div>' +

                '<div class="chat_ib">' +

                '<h5>' + user.username + '<span class="chat_date">Dec 25</span></h5>' +

                '<p>' + user.email +'</p>' +

                '</div>' +

                '</div>' +

                '</div>';
        })
        $("div.inbox_chat").html(html);
    });
    console.log("ok");
}

$("input.search-bar").on("keyup", function(e){

    if ((e.keyCode || e.which) == 13){
            searchUser();
    }
});
