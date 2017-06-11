<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Restaurant;
use App\Evaluation;
use DateTime;
use DB;

class EvaluationController extends Controller
{
	public function check(Request $request)
	{
		$evaluations = Evaluation::where('user_id','=',$request->user_id)
					->where('restaurant_id','=',$request->restaurant_id)->first();
		return Response()->json([
            'data' => $evaluations
        ], 200);
	}
    public function store(Request $request)
    {
    	DB::beginTransaction();
    	try {
    		$evaluation = new Evaluation;
	    	$evaluation->user_id = $request->user_id;
	    	$evaluation->restaurant_id = $request->restaurant_id;
	    	$evaluation->point = $request->point;
	    	$evaluation->save();

	    	$point = Evaluation::where('restaurant_id','=',$request->restaurant_id)->avg('point');

	    	$res = Restaurant::find($request->restaurant_id);
	    	$res->point = number_format($point);
	    	$res->save();

	    	DB::commit();

	    	return Response()->json([
	            'evaluation' => $evaluation,
	            'point' => number_format($point),
	            'res' => $res,
	        ], 200);

    	} catch (Exception $e) {
    		DB::rollBack();
    		return Response()->json([
	            'error' => 'Đã có lỗi xảy ra',
	            'data' => $e->getMessage()
	        ], 422);
    	}
    }
}
