<?php

namespace App\Http\Controllers\UserRestaurant;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Restaurant;
use Validator;
use DB;
use DateTime;

class RestaurantController extends Controller
{
	
    function index(Request $request)
    {
        $restaurants = Restaurant::where('user_id','=',$request->user_id)->get();
    	return response()->json([
            'data' => $restaurants
        ],200);
    }
    
    /**
     * đăng ký mới 1 địa điểm
     * @param  Request $request [dữ liệu từ client gửi lên]
     * @return [json]           [thông báo]
     */
    function store(Request $request)
    {
    	$rules = [
        	'name' => 'required|unique:restaurants,name',
        	'email' => 'required|email',
        	'phone' => 'required|regex:/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/',
            'open' => 'required|date_format:H:i',
            'close' => 'required|date_format:H:i|after:open',
        	'min' => 'required',
        	'max' => 'required',
        	'place' => 'required',
        	'wardid' => 'required',
        	'categoryid' => 'required'
        ];
        $messages = [
		    'name.required' => 'Tên địa điểm không được để trống',
		    'name.unique' => 'Tên địa điểm đã tồn tại',
		    'email.required' => 'Email không được để trống',
		    'email.email' => 'Email không đúng định dạng',
            'phone.required' => 'Số điện thoại không được để trống',
		    'phone.regex' => 'Số điện thoại không đúng định dạng',
            'open.required' => 'Giờ mở cửa không được để trống',
		    'open.date_format' => 'Giờ mở cửa không đúng định dạng',
            'close.required' => 'Giờ đóng cửa không được để trống',
            'close.date_format' => 'Giờ đóng cửa không đúng định dạng',
		    'close.after' => 'Giờ đóng cửa phải sau giờ mở cửa',
            'min.required' => 'Giá nhỏ nhất không được để trống',
            'max.required' => 'Giá lớn nhất không được để trống',
		    'place.required' => 'Vị trí địa điểm không được để trống',
		    'wardid.required' => 'Bạn chưa chọn khu vực địa điểm',
		    'categoryid.required' => 'Bạn chưa chọn loại địa điểm'
		];
        // kiểm tra dữ liệu từ client gửi lên
		$validator = Validator::make($request->all(), $rules, $messages);
        // dd($validator->fails());
        // nếu tồn tại lỗi
        if ($validator->fails()) {
            return Response()->json([
                'message' => 'Thêm mới danh mục không thành công',
                'error' => $validator->messages(),
                'data' => $request->all()
            ], 422);
        }
        if($request->file) {
            $filename = time().'.'.explode('.',$request->file->getClientOriginalName())[1];
            $request->file->move('public/images/', $filename);
        }

        // tạo mới 1 địa điểm trong bảng restaurants
        $restaurant = new Restaurant;
        $restaurant->name = $request->name;
        $restaurant->slug = str_slug($request->name,"-");
        $restaurant->email = $request->email;
        $restaurant->phone = $request->phone;
        if($request->file) {
            $restaurant->image = $filename;
        }
        $restaurant->open = $request->open;
        $restaurant->close = $request->close;
        $restaurant->min = $request->min;
        $restaurant->max = $request->max;
        $restaurant->description = $request->description;
        $restaurant->point = 0;
        $restaurant->place = $request->place;
        $restaurant->wardid = $request->wardid;
        $restaurant->category_id = $request->categoryid;
        $restaurant->user_id = $request->userid;
        $restaurant->save();
        // đăng ký mới thành công
    	return Response()->json([
            'message' => 'Đăng ký địa điểm thành công',
        ], 200);
    }

    function show($id)
    {
        $restaurant = Restaurant::select('restaurants.id','restaurants.name','restaurants.slug','restaurants.email',
                                'restaurants.phone','restaurants.image','restaurants.open','restaurants.close',
                                'restaurants.min','restaurants.max','restaurants.description','restaurants.point',
                                'restaurants.place','restaurants.wardid','restaurants.category_id',
                                'restaurants.user_id','restaurants.created_at',
                                'wards.name as ward_name','districts.name as district_name',
                                'provinces.name as province_name', DB::raw('count(foods.id) as count'))
                            ->join('wards', 'restaurants.wardid', '=', 'wards.wardid')
                            ->join('districts', 'districts.districtid', '=', 'wards.districtid')
                            ->join('provinces', 'provinces.provinceid', '=', 'districts.provinceid')
                            ->leftJoin('foods', 'restaurants.id', '=', 'foods.restaurant_id')
                            ->where('restaurants.status','=',1)
                            ->where('restaurants.id','=',$id)
                            ->groupBy('restaurants.id','restaurants.name','restaurants.slug','restaurants.email',
                                'restaurants.phone','restaurants.image','restaurants.open','restaurants.close',
                                'restaurants.min','restaurants.max','restaurants.description','restaurants.point',
                                'restaurants.place','restaurants.wardid','restaurants.category_id',
                                'restaurants.user_id','restaurants.created_at',
                                'wards.name','districts.name',
                                'provinces.name')
                            ->first();
        // $restaurant = Restaurant::where('status','=',1)
        // ->with(['ward' => function($query){
        //     $query->select('name');
        // }])
        // ->with(['category' => function($query){
        //     $query->select('name');
        // }])->first();
        return Response()->json([
            'data' => $restaurant
        ], 200);
    }

    public function update(Request $request, $id)
    {
        // dd($request->all());
        $rules = [
            'name' => 'required|unique:restaurants,name,'.$id,
            'email' => 'required|email',
            'phone' => 'required',
            'open' => 'required|date_format:H:i',
            'close' => 'required|date_format:H:i|after:open',
            'min' => 'required',
            'max' => 'required',
            'place' => 'required',
            'wardid' => 'required',
            'category_id' => 'required'
        ];
        $messages = [
            'name.required' => 'Tên địa điểm không được để trống',
            'name.unique' => 'Tên địa điểm đã tồn tại',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không đúng định dạng',
            'phone.required' => 'Số điện thoại không được để trống',
            'open.required' => 'Giờ mở cửa không được để trống',
            'open.date_format' => 'Giờ mở cửa không đúng định dạng',
            'close.required' => 'Giờ đóng cửa không được để trống',
            'close.date_format' => 'Giờ đóng cửa không đúng định dạng',
            'close.after' => 'Giờ đóng cửa phải sau giờ mở cửa',
            'min.required' => 'Giá nhỏ nhất không được để trống',
            'max.required' => 'Giá lớn nhất không được để trống',
            'place.required' => 'Vị trí địa điểm không được để trống',
            'wardid.required' => 'Bạn chưa chọn khu vực địa điểm',
            'categoryid.required' => 'Bạn chưa chọn loại địa điểm'
        ];
        // kiểm tra dữ liệu từ client gửi lên
        $validator = Validator::make($request->all(), $rules, $messages);
        // dd($validator->fails());
        // nếu tồn tại lỗi
        if ($validator->fails()) {
            return Response()->json([
                'message' => 'Thêm mới danh mục không thành công',
                'error' => $validator->messages(),
                'data' => $request->all()
            ], 422);
        }

        if($request->file) {
            $filename = time().'.'.explode('.',$request->file->getClientOriginalName())[1];
            $request->file->move('public/images/', $filename);
        }

        // tạo mới 1 địa điểm trong bảng restaurants
        $restaurant = Restaurant::find($id);
        $restaurant->name = $request->name;
        $restaurant->slug = str_slug($request->name,"-");
        $restaurant->email = $request->email;
        $restaurant->phone = $request->phone;
        if($request->file) {
            $restaurant->image = $filename;
        }
        $restaurant->open = $request->open;
        $restaurant->close = $request->close;
        $restaurant->min = $request->min;
        $restaurant->max = $request->max;
        $restaurant->description = $request->description;
        $restaurant->point = 0;
        $restaurant->place = $request->place;
        $restaurant->wardid = $request->wardid;
        $restaurant->category_id = $request->category_id;
        $restaurant->user_id = $request->user_id;
        $restaurant->updated_at = new DateTime();
        $restaurant->save();
        // cập nhật thành công
        return Response()->json([
            'message' => 'Cập nhật điểm thành công',
            'data' => $restaurant
        ], 200);
    }
}
