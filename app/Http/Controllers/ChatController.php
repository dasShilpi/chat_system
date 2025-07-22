<?php

namespace App\Http\Controllers;

use App\Events\SendMessageEvent;
use App\Models\Messages;
use App\Models\User;
use App\View\Components\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    function view_message() {
        $users = User::where('id', '!=', auth()->user()->id)->get();
        return view('viewMessage',compact('users'));
    }

    public function fetchMessage(Request $request) 
    {
        $contact = User::findOrFail($request->contactId);

        $messages = Messages::where('from_id', Auth::user()->id)
            ->where('to_id', $request->contactId)
            ->orWhere('from_id', $request->contactId)
            ->where('to_id', Auth::user()->id)
            ->get();
        
            
            
        return response()->json([
            'contact' => $contact,
            'messages' => $messages
        ]);
    }

    public function sendMessage(Request $request) 
    {
        $request->validate([
            'contactId' => ['required'],
            'message' => ['required', 'string']
        ]);
        
        $message = new Messages();
        $message->from_id = Auth::user()->id;
        $message->to_id = $request->contactId;
        $message->message = $request->message;
        $message->save();
        
        event(new SendMessageEvent($message->message,Auth::user()->id,$request->contactId));

        return response($message);

        // return response()->json([
        //     'message' => $request->input('message'),
        //     'contactId' => $request->input('contactId')
        // ]);
    }

    
}
