<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Restaurant;
use App\Notification;
use DateTime;
use DB;

class RestaurantController extends Controller
{
    public function listRestaurant()
    {
        $restaurants = Restaurant::where('status','=',1)->get();
        return Response()->json([
            'data' => $restaurants
        ]);
    }

    public function listRegisterRestaurant()
    {
        $restaurants = Restaurant::where('status','=',0)->get();
        return Response()->json([
            'data' => $restaurants
        ]);
    }

    public function show($id)
    {
        $restaurant = Restaurant::find($id);
        return Response()->json([
            'data' => $restaurant
        ]);
    }

    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $restaurant = Restaurant::where('id',$id)->first();
            $restaurant->status = 1;
            $restaurant->updated_at = new DateTime();
            $restaurant->save();

            $user_id = $restaurant->user_id;

            $noti = new Notification;
            $noti->user_id = $user_id;
            $noti->restaurant_id = $id;
            $noti->type = 2;
            $noti->content = 'địa điểm '.$restaurant->name.' của bạn đã được phê duyệt';
            $noti->status = 0;
            $restaurant->created_at = new DateTime();
            $noti->save();

            DB::commit();

            return Response()->json([
                'message' => 'Phê duyệt thành công',
                'restaurant' => $restaurant
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            return Response()->json([
                'error' => 'Đã có lỗi xảy ra',
                'data' => $e->getMessage()
            ], 422);
        }
        
    }

    public function delete($id)
    {
        Restaurant::find($id)->delete();
        return Response()->json([
            'message' => 'Xóa thành công',
        ], 200);
    }

}
