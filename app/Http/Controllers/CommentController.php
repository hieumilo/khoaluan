<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Comment;
use App\comment_Image;
use DB;
use DateTime;

class CommentController extends Controller
{
	public function index($id)
	{
		$comments = Comment::select('comments.*', 'users.name as user_name')
				->join('users', 'users.id', '=', 'comments.user_id')
				->where('restaurant_id','=',$id)
				->with('images')
				->orderBy('comments.created_at','desc')
				->paginate(2);
		return Response()->json([
            'data' => $comments
        ], 200);
	}

    public function store(Request $request)
    {
    	DB::beginTransaction();
    	try {
    		$comment = new Comment;
    		$comment->restaurant_id = $request->restaurant_id;
    		$comment->user_id = $request->user_id;
    		$comment->title = $request->title;
    		$comment->content = $request->content;
    		$comment->created_at = new DateTime();
    		$comment->save();

    		$comment_id = $comment->id;
            if($request->files) {
                foreach ($request->files as $files) {
                    foreach ($files as $file) {

                        if(isset($file)){
                            $filename = rand(1000,10000).'_'.time().'.'.explode('.',$file->getClientOriginalName())[1];
                            $file->move('public/images/comment/', $filename);

                            $img = new comment_Image;
                            $img->image = $filename;
                            $img->comment_id = $comment_id;
                            $img->created_at = new DateTime();
                            $img->save();
                        }
                    }
                }
            }

    		DB::commit();

    		$comments = Comment::select('comments.*', 'users.name as user_name')
				->join('users', 'users.id', '=', 'comments.user_id')
				->where('restaurant_id','=',$request->restaurant_id)
				->with('images')
				->orderBy('comments.created_at','desc')
				->paginate(2);

    		return Response()->json([
	            'message' => 'thành công',
	            'data' => $comments
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
