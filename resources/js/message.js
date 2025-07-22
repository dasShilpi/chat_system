const selectedContact = $('meta[name="selected_user"]');
const authId = $('meta[name="auth_id"]').attr('content');
const baseUrl = $('meta[name="base_url"]').attr('content');
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


function fetchMessages() {
    let contactId = $('meta[name="selected_user"]').attr('content');

    $.ajax({
        method: 'GET',
        url: baseUrl + '/fetch-messages', // Adjust this to your route
        data: {
            contactId : contactId
        },
        beforeSend: function() {
            $('.index-loader-container').show();
        },
        success: function(data) {

            contactInfo(data.contact);
            let inbox = $('#conversation');
            inbox.empty();

            data.messages.forEach(value => {
                if(value.from_id == contactId) {
                    inbox.append(messageTemplate(value.message, 'message-main-receiver','receiver','sun'));
                } else {
                    inbox.append(messageTemplate(value.message, 'message-main-sender','sender','sun'));
                }
            });

            scrollToBottom();
        },
        error: function(xhr, status, error) {
            console.error('Error fetching messages:', error);
        },
        complete: function(){
            $('.index-loader-container').hide();
        }
    });
}

function toggleLoader(){
    $('.index-loader-container').toggleClass('d-none');
}
function contactInfo(data){
    $('.heading-name-meta').text(data.name);

}

function messageTemplate(text,mainClass,receiverClass,time){
    return `<div class="row message-body">
        <div class="col-sm-12 ${ mainClass }">
            <div class="${ receiverClass }">
                <div class="message-text">
                    ${ text }
                </div>
                <span class="message-time pull-right">
                    ${ time }
                </span>
            </div>
        </div>
    </div>`;
}

// function scrollToBottom(){
//     $('.conversation').stop().animate({
//         scrollTop: $('.conversation')[0].scrollHeight
//     });
// }

function scrollToBottom() {
    const $container = $('.conversation');

    if ($container.length > 0) {
        $container.animate({
            scrollTop: $container[0].scrollHeight
        }, 300); // animation speed
    } else {
    }
}
$(document).ready(function() {
    $('.contact').on('click', function() {

        let contactId = $(this).data('id');
        selectedContact.attr('content', contactId);
        fetchMessages();
        $('.blank-wrap').hide();
    });

    $('#send-button').on('click', function () {
        let contactId = $('meta[name="selected_user"]').attr('content');
        let message = $('#comment').val(); // Get message from input
        let inbox = $('#conversation');
        if (!message || !message.trim()) return;

        var formData = {
            message: message.trim(),
            contactId: contactId,
            _token: csrfToken  // Add CSRF token for security
        };

        // Send AJAX request
        $.ajax({
            url: baseUrl + '/send-messages',  // The URL for the POST route
            type: 'POST',
            data: formData,
            success: function(response) {
                // Handle success
                $('#responseMessage').html('<p>' + response.message + '</p>');
                inbox.append(messageTemplate(message, 'message-main-sender','sender','sun'));
                $('#comment').val('');
                scrollToBottom();
            },
            error: function(xhr, status, error) {
                // Handle error
                $('#responseMessage').html('<p>Error: ' + xhr.responseJSON.message + '</p>');
            }
        });

    });
});

// window.Echo.private('message.'+authId).listen('SendMessageEvent',(e)=>{
    // document.getElementById('messages').innerHTML += `<p>${e.message}</p>`
    
// });

window.Echo.private('message.'+authId).listen('SendMessageEvent',(e)=>{

    if(e.from_id == selectedContact.attr('content')){
        let inbox = $('#conversation');
        inbox.append(messageTemplate(e.message, 'message-main-receiver','receiver','sun'));
        // document.getElementById('messages').innerHTML += `<p>${e.message}</p>`
    }
});

window.Echo.join('online')
.here(users=>{
    console.log('here',users);

    users.forEach(user => {
        console.log(user.id);
        let element = $(`.contact[data-id="${user.id}"]`);
        if (element.length > 0) {
            element.find('.status-dot').removeClass('offline');
            element.find('.status-dot').addClass('online');
        } else {
            element.find('.status-dot').removeClass('online');
            element.find('.status-dot').addClass('offline');
        }
    });

})
.joining(user=>{
    console.log('Joining',user);
    let element = $(`.contact[data-id="${user.id}"]`);
    element.find('.status-dot').removeClass('offline');
    element.find('.status-dot').addClass('online');
})
.leaving(user=>{
    console.log('Leaving',user);
    let element = $(`.contact[data-id="${user.id}"]`);
    element.find('.status-dot').removeClass('online');
    element.find('.status-dot').addClass('offline');
});