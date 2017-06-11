<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\User;
use App\Notification;
use JWTAuth;
use DateTime;
use DB;

class UserController extends Controller
{
    // public function __construct()
    // {
    //    $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    // }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return Response()->json([
            'data' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::find($id);
        return Response()->json([
            'data' => $user
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user_id = $request->id;
        if($user_id == 1) {
            return response()->json(['error' => 'Bạn không thể khóa tài khoản này'], 401);
        }
        $user = JWTAuth::parseToken()->authenticate();
        if($user->id == 1) {
            $status = $request->status == 0?1:0;
            $lock = $request->status == 0?true:false;

            $user = User::where('id',$user_id)->first();
            $user->status = $status;
            $user->updated_at = new DateTime();
            $user->save();
            return response()->json([
                'user' => $user,
                'lock' => $lock,
                'message' => 'Thành công'
            ], 200);
        }
        if($user->level == 0) {
            if($request->level == 0) {
                return response()->json(['error' => 'Bạn không thể khóa tài khoản này'], 401);
            }
            $status = $request->status == 0?1:0;
            $lock = $request->status == 0?true:false;

            DB::beginTransaction();
            try {

                if($status == 1) {
                    $noti = new Notification;
                    $noti->user_id = $user_id;
                    $noti->type = 0;
                    $noti->content = 'lý do khóa';
                    $noti->status = 0;
                    $noti->created_at = new DateTime();
                    $noti->save();
                }

                $user = User::where('id',$user_id)->first();
                $user->status = $status;
                $user->updated_at = new DateTime();
                $user->save();
                
                DB::commit();

                return response()->json([
                    'user' => $user,
                    'lock' => $lock,
                    'message' => 'khóa tài khoản thành công'
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

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
