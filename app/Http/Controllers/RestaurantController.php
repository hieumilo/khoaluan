<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Validator;
use App\Restaurant;
use App\Food;

class RestaurantController extends Controller
{
    /**
     * [index description]
     * @return [type] [description]
     */
    function index(Request $request){
        $restaurants = Restaurant::select('restaurants.*',
                                'wards.name as ward_name','districts.name as district_name',
                                'provinces.name as province_name','categories.name as category_name','categories.slug as category_slug')
                            ->join('wards', 'restaurants.wardid', '=', 'wards.wardid')
                            ->join('districts', 'districts.districtid', '=', 'wards.districtid')
                            ->join('provinces', 'provinces.provinceid', '=', 'districts.provinceid')
                            ->join('categories', 'categories.id', '=', 'restaurants.category_id')
                            ->where('status','=',1);
        if($request->category) {
            $restaurants = $restaurants->where('categories.id', '=', $request->category);
        }
        if($request->search) {
            $restaurants = $restaurants->where('restaurants.name', 'LIKE', "%{$request->search}%");
        }
        if($request->provinceid){
            $restaurants = $restaurants->where('districts.provinceid', '=', $request->provinceid)->paginate(6);
        }
        if($request->districtid){
            $restaurants = $restaurants->where('wards.districtid', '=', $request->districtid)->paginate(6);
        }
        if($request->wardid) {
            $restaurants = $restaurants->where('restaurants.wardid', '=', $request->wardid)->paginate(6);
        }
        return Response()->json([
            'data' => $restaurants
        ], 200);
    }

    function show(Request $request, $id)
    {
        $restaurant = Restaurant::select('restaurants.*',
                                'wards.name as ward_name','districts.name as district_name',
                                'provinces.name as province_name')
                            ->join('wards', 'restaurants.wardid', '=', 'wards.wardid')
                            ->join('districts', 'districts.districtid', '=', 'wards.districtid')
                            ->join('provinces', 'provinces.provinceid', '=', 'districts.provinceid')
                            ->where('status','=',1)
                            ->where('id','=',$id)
                            ->first();
        $foods = Food::where('restaurant_id','=',$id)->with('images')->get();
        return Response()->json([
            'restaurant' => $restaurant,
            'foods' => $foods
        ], 200);
    }

    function getFoodsByRestaurantid($id)
    {
        $foods = Food::where('restaurant_id','=',$id)->with('images')->get();
        return Response()->json([
            'data' => $foods
        ], 200);
    }

}
