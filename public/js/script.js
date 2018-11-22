$(document).ready(function() {

    $(".write_msg").on("keyup", function (e) {

        if ((e.keyCode || e.which) == 13) {

            var text = $(this).val();

            if (text !== "") {

                insertChat("me", text);

                $(this).val('');

            }

        }

    });

    function insertChat(who, text, time) {

        if (time === undefined) {

            time = 0;

        }

        var control = "";

        var date = new Date().toLocaleDateString("fr-FR");

        if (who == "me") {

            control = '<div class="outgoing_msg">' +

                '<div class="sent_msg">' +

                '<p>' + text + '</p>' +

                '<span class="time_date">' + date + '</span>' +

                '</div>' +

                '</div>';

        } else {

            control = '<div class="incoming_msg">' +

                '<div class="incoming_msg_img"><img src="/slaque/public/img/chat.jpg" alt="sunil"> </div>'

                '<div class="received_msg">' +

                '<div class="received_withd_msg">' +

                '<p>' + text + '</p>' +

                '<span class="time_date">' + date + '</span>' +

                '</div>' +

                '</div>' +

                '</div>';
        }

        $("div .msg_history").append(control).scrollTop($("div .msg_history").prop('scrollHeight'));

    }

})