<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Suggesstion;
use Mail;

class SuggesstionController extends Controller
{
    public function index()
    {
    	$suggesstions = Suggesstion::orderBy('status','asc')->orderBy('created_at','asc')->get();
        return Response()->json([
            'data' => $suggesstions
        ]);
    }

    public function show($id)
    {
    	$suggesstion = Suggesstion::find($id);
        return Response()->json([
            'data' => $suggesstion
        ]);
    }

    public function send(Request $request)
    {
    	$mailto = $request->suggesstion['email'];
    	$content = $request->mail['content'];
    	Mail::send([],[], function ($message) use($mailto, $content) {
    	
    	    $message->to($mailto);
    	
    	    $message->subject('Cảm ơn ý kiến');

    	    $message->setBody($content, 'text/html');
    	
    	});

        $suggesstion = Suggesstion::find($request->suggesstion['id']);
        $suggesstion->status = 1;
        $suggesstion->save();

    	return Response()->json([
    		'message' => 'Gửi thành công',
            'data' => $suggesstion
        ]);
    }
}
