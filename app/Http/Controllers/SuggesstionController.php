<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Suggesstion;
use Validator;
use DateTime;

class SuggesstionController extends Controller
{
    public function store(Request $request)
    {
    	$rules = [
        	'email' => 'required|email',
        	'title' => 'required',
        	'content' => 'required',
        ];
        $messages = [
		    'email.required' => 'Email không được để trống',
		    'email.email' => 'Email không dúng định dạng',
		    'title.required' => 'Tiêu đề không được để trống',
		    'content.required' => 'Nội dung không được để trống',
		];
		$validator = Validator::make($request->all(), $rules, $messages);
        // dd($validator->fails());
        if ($validator->fails()) {
            return Response()->json([
                'message' => 'Góp ý không thành công',
                'error' => $validator->messages()
            ], 422);
        }

        $sugg = new Suggesstion;
        $sugg->email = $request->email;
        $sugg->title = $request->title;
        $sugg->content = $request->content;
        $sugg->created_at = new DateTime();
        $sugg->save();

        return Response()->json([
            'message' => 'Cảm ơn sự góp ý của bạn',
        ], 200);
    }
}
