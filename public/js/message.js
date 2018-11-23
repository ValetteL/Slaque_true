function loadMessages(){
    //console.log("loadMessage(" + $(".active_chat").data("id") + ")");

    //si on charge les messages d'un user
    if($(".active_chat").length) {
        $.ajax({
            url: $("#load-messages").data("url"),
            data: {
                'receiver': $(".active_chat").data("id")
            },
            method: 'post'
        }).done(function (messages) {
            let html = "";
            messages.forEach(function (message) {
                console.log("message.author : " + message.author  + ", message.dateCreated : " + message.dateCreated + ", message.content : " + message.content);
                if (message.author != $("#user_id").val()) {
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

    //Sinon les messages d'un groupe
    } else {
        console.log("group id = " + $("#group_button").attr('data-id'));
        $.ajax({
            url: $("#load-messages").data("url"),
            data: {
                'groupId': $("#group_button").attr('data-id')
            },
            method: 'post'
        }).done(function (group) {
            console.log('group messages : ' + group.messages);
            let html = "";
            group.messages.forEach(function (message) {
                console.log(message);
                //console.log("message.author : " + message.author + ", message.dateCreated : " + message.dateCreated + ", message.content : " + message.content);
                console.log("message.author.id : " + message.author + " == " + $("#user_id").val())
                if (message.author != $("#user_id").val()) {
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
}

$(".inbox_people").on("click","div.chat_list", function(){
    //console.log("clicked");
    $("div.chat_list").removeClass("active_chat");
    $(this).addClass("active_chat");
    loadMessages();
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function sendMessage(e){
    e.preventDefault();
    //Si on envoi à un user
    if($(".active_chat").length) {
        console.log("receiver id = " + $(".active_chat").data("id"));
        $.ajax({
            url: $("#last-message").data("url"),
            data: {
                'message': $("#message_content").val(),
                'receiver': $(".active_chat").data("id")
            },
            method: 'post'
        }).done(function () {
            $("#message_content").val('');
            loadMessages();
        })
    //Sinon à une conv
    } else {
        console.log("group id = " + $("button.dropdown-toggle").data("id"));
        $.ajax({
            url: $("#last-message").data("url"),
            data: {
                'message': $("#message_content").val(),
                'groupId': $("button.dropdown-toggle").data("id")
            },
            method: 'post'
        }).done(function (group) {
            loadMessages();
            $("#message_content").val('');
            console.log("message envoyé !");
        })
    }
}

$("form[name='message']").on("submit", sendMessage);

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
    //console.log("group id : " + id);
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
            console.log("member : " + member.id);
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
        loadMessages();
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
        //console.log("showgroup(" + group.id + ")");
        showGroup(group.id);
    })
    $(".close").click();
}

$("form[name='member']").on("submit", addMember);


//Actualisation des messages toutes les 3 secondes
setInterval(loadMessages, 3000);


