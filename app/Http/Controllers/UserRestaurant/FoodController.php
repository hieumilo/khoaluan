<?php

namespace App\Http\Controllers\UserRestaurant;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Food;
use App\Food_Image;
use Validator;
use Exception;
use DB;
use DateTime;

class FoodController extends Controller
{
    public function index($id)
    {
    	$foods = Food::where('restaurant_id','=',$id)->with('images')->get();
    	return Response()->json([
            'data' => $foods
        ], 200);
    }

    public function store(Request $request, $id)
    {
    	// dd($request->all());
    	// dd($request->files);

    	$rules = [
        	'name' => 'required|unique:foods,name',
        	'price' => 'required|numeric',
        ];
        $messages = [
		    'name.required' => 'Tên món không được để trống',
		    'name.unique' => 'Tên món đã tồn tại',
		    'price.required' => 'Giá không được để trống',
		    'price.numeric' => 'Giá không đúng định dạng'
		];
		$validator = Validator::make($request->all(), $rules, $messages);
		if ($validator->fails()) {
            return Response()->json([
                'message' => 'Thêm mới món không thành công',
                'error' => $validator->messages()
            ], 422);
        }

        if(count($request->files)) {
      //   	$rules = [];
		    // foreach ($request->files as $key => $value) {
		    // 	$rules['file'] = 'required|mimes:png,jpeg,jpg,gif';
		    // }
		    // $validator = Validator::make($request->files , $rules);

		    // if ($validator->fails()) {
	     //        return Response()->json([
	     //            'message' => 'Thêm mới món không thành công',
	     //            'error' => $validator->messages()
	     //        ], 422);
	     //    }
        } else {
            return Response()->json([
                'message' => 'Thêm mới món không thành công',
                'error' => 'Bạn chưa chọn ảnh'
            ], 422);
        }
    	
    	DB::beginTransaction();
    	try {
    		$food = new Food;
    		$food->name = $request->name;
    		$food->slug = str_slug($request->name, '-');
    		$food->description = $request->description;
    		$food->price = $request->price;
    		$food->restaurant_id = $id;
    		$food->created_at = new DateTime();
    		$food->save();

    		$food_id = $food->id;
            if($request->files) {
                foreach ($request->files as $files) {
                    foreach ($files as $file) {

                        if(isset($file)){
                            $filename = time().'.'.explode('.',$file->getClientOriginalName())[1];
                            $file->move('public/images/', $filename);

                            $img = new Food_Image;
                            $img->image = $filename;
                            $img->food_id = $food_id;
                            $img->created_at = new DateTime();
                            $img->save();
                        }
                    }
                }
            }

    		DB::commit();

    		return Response()->json([
	            'message' => 'Thêm mới món ăn thành công',
	            'data' => $food
	        ], 200);
    	} catch (Exception $e) {
    		DB::rollBack();

    		return Response()->json([
	            'error' => 'Đã có lỗi xảy ra',
	            'data' => $e->getMessage()
	        ], 422);
    	}
    }

    public function show($id)
    {
        $food = Food::where('id','=',$id)->with('images')->get();
        return Response()->json([
            'data' => $food
        ], 200);
    }
    public function update(Request $request, $id)
    {
        $rules = [
            'name' => 'required|unique:foods,name,'.$id,
            'price' => 'required|numeric',
        ];
        $messages = [
            'name.required' => 'Tên món không được để trống',
            'name.unique' => 'Tên món đã tồn tại',
            'price.required' => 'Giá không được để trống',
            'price.numeric' => 'Giá không đúng định dạng'
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return Response()->json([
                'message' => 'Cập nhật món không thành công',
                'error' => $validator->messages()
            ], 422);
        }

        DB::beginTransaction();
        try {
            $food = Food::find($id);
            $food->name = $request->name;
            $food->slug = str_slug($request->name, '-');
            $food->description = $request->description;
            $food->price = $request->price;
            $food->created_at = new DateTime();
            $food->save();

            $food_id = $food->id;

            if($request->file) {

                foreach ($food->images as $img) {
                    Food_Image::find($img->id)->delete();
                }

                $filename = time().'.'.explode('.',$request->file->getClientOriginalName())[1];
                $request->file->move('public/images/', $filename);

                $img = new Food_Image;
                $img->image = $filename;
                $img->food_id = $food_id;
                $img->created_at = new DateTime();
                $img->save();
            }
            DB::commit();

             $f = Food::where('id','=',$food->id)->with('images')->get();

            return Response()->json([
                'message' => 'Cập nhật món ăn thành công',
                'data' => $f
            ], 200);
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
        Food::find($id)->delete();
        return Response()->json([
            'message' => 'Xóa món thành công',
        ], 200);
    }
}
