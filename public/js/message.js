function loadMessages(){
    //console.log("loadMessage(" + $(".active_chat").data("id") + ")");
    $.ajax({
        url: $("#load-messages").data("url"),
        data: {
            'receiver' : $(".active_chat").data("id")
        },
        method: 'post'
    }).done(function (messages) {
        let html = "";
        messages.forEach(function (message) {
            console.log("message.author : " + message.author + ", message.receiver : " + message.receiver + ", message.dateCreated : " + message.dateCreated + ", message.content : " + message.content);
            if(message.author == $(".active_chat").data("id")){
                html += '<div class="incoming_msg">' +

                    '<div class="incoming_msg_img"> <img src="/slaque/public/img/chat.jpg"> </div>' +

                    '<div class="received_msg">' +

                    '<div class="received_withd_msg">' +

                    '<p>' + message.content + '</p>' +

                    '<span class="time_date">' + message.dateCreated + '</span>' +

                    '</div>' +

                    '</div>';
            } else {
                html += '<div class="outgoing_msg">' +

                    '<div class="sent_msg">' +

                    '<p>' + message.content + '</p>' +

                    '<span class="time_date">' + message.dateCreated + '</span>' +

                    '</div>' +

                    '</div>';
            }
        })
        //console.log("html : " + html);
        $("div.msg_history").html(html).scrollTop($("div.msg_history").prop('scrollHeight'));
    });
}

$(".inbox_people").on("click","div.chat_list", function(){
    //console.log("clicked");
    $("div.chat_list").removeClass("active_chat");
    $(this).addClass("active_chat");
    loadMessages();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function doAjax(e){
    e.preventDefault();
    console.log("test id = " + $(".active_chat").data("id"));
    $.ajax({
        url: $("#last-message").data("url"),
        data: {
            'message' : $("#message_content").val(),
            'receiver' : $(".active_chat").data("id")
        },
        method: 'post'
    }).done(function (messages) {
        console.log(messages);
        messages.forEach(function (message) {
            let html = '<div class="outgoing_msg">' +

            '<div class="sent_msg">' +

            '<p>' + message.content + '</p>' +

            '<span class="time_date">' + message.dateCreated + '</span>' +

            '</div>' +

            '</div>';
            $("div.msg_history").append(html).scrollTop($("div.msg_history").prop('scrollHeight'));
            $("#message_content").val('');
            console.log("message envoyé !");
        //})
        });
    })
}

$("form[name='message']").on("submit", doAjax);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function searchUser(e){
    e.preventDefault()
    $.ajax({
        url: $("#search-user").data("url"),
        data: {
            'search' : $("#search_user_username").val()
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

$("form[name='search_user']").on("submit", searchUser);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createGroup(e){
    e.preventDefault();
    console.log("test : " + $("#group_name").val());
    $.ajax({
        url: $("#create-group").data("url"),
        data: {
            'groupName' : $("#group_name").val()
        },
        method: 'post'
    }).done(function (groups) {
        console.log(groups);
        let html = '<div class="dropdown">' +

                    '<button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown">' +

                    '</button>' +

                    '<div class="dropdown-menu">';

        groups.forEach(function (group) {
            console.log(group.name);
            html += '<a id="show-group" class="dropdown-item" data-id="' + group.id + '" data-url="api/group/show">' + group.name + '</a>';
        });

        html += '</div>' +

                '<a href="" data-toggle="modal" data-target="#modalGroupForm">' +

                '<button class="btn"><i class="fas fa-plus"></i></button>' +

                '</a>' +

                '</div>';

        $("div.recent_heading").html(html);
        $(".close").click();
    });
    //console.log("ok");
}

$("form[name='group']").on("submit", createGroup);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function showGroup(id){
    console.log("group id : " + id);
    $.ajax({
        url: $("#show-group").data("url"),
        data: {
            'id' : id
        },
        method: 'post'
    }).done(function (group) {
        console.log(group.members);
        let html = '<button id="return_friendlist" type="button" class="btn btn-secondary btn-lg"> < </button>' +
                '<a href="" data-toggle="modal" data-target="#modalMemberForm">' +
                    '<button type="button" class="btn btn-secondary btn-lg"> + </button>' +
                '</a>' +
                '<div class="inbox_chat_list">';
        group.members.forEach(function (member) {
            console.log("member : " + member);
            html += '<div class="chat_list" data-id="' + member.id + '">' +

                '<div class="chat_people">' +

                '<div class="chat_img"> <img src="/slaque/public/img/chat.jpg" alt="yo"> </div>' +

                '<div class="chat_ib">' +

                '<h5>' + member.username + '<span class="chat_date">Dec 25</span></h5>' +

                '<p>' + member.email +'</p>' +

                '</div>' +

                '</div>' +

                '</div>';
        })
        html += '</div>';
        $("div.inbox_chat").html(html);

    });
}

$(".recent_heading").on("click", '#show-group', function(){
    //console.log("oui");
    $("div.chat_list").removeClass("active_chat");
    showGroup($(this).data('id'));
    $("button.dropdown-toggle").attr( 'data-id', $(this).data('id'));
    $("button.dropdown-toggle").html($(this).text());
});

$(".inbox_chat").on("click", '#return_friendlist', searchUser);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function addMember(e){
    e.preventDefault();
    console.log("test id = " + $("#member_user").val());
    $.ajax({
        url: $("#add_member").data("url"),
        data: {
            'groupId' : $("button.dropdown-toggle").data('id'),
            'userId' : $("#member_user").val()
        },
        method: 'post'
    }).done(function (group) {
        console.log("showgroup(" + group.id + ")");
        showGroup(group.id);
    })
}

$("form[name='member']").on("submit", addMember);


setInterval(loadMessages, 2000);


