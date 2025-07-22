
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
const authId = $('meta[name="auth_id"]').attr('content');
window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    encrypted: true
});

// for public channel 
// window.Echo.channel('chat').listen('NewMessage',(e)=>{
//     console.log(e);
//     document.getElementById('messages').innerHTML += `<p>${e.message}</p>`
    
// });

//for privet channel

// var userId = document.querySelector('meta[name="user_id"]').getAttribute('content');
// console.log(userId);
// window.Echo.private('chat.'+userId).listen('NewMessage',(e)=>{
//     console.log(e);
//     document.getElementById('messages').innerHTML += `<p>${e.message}</p>`
    
// });

// window.Echo.join('online')
// .here(user=>{
//     console.log(user);
// })
// .joining(user=>{
//     console.log('Joining',user);
// })
// .leaving(user=>{
//     console.log('Leaving',user);
// });

