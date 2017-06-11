<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\District;
use App\Province;
use App\Ward;
use App\Street;
use App\Restaurant;
use DB;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function getProvinces()
    {
        $provinces = Province::select('provinces.provinceid', 'provinces.name', 'provinces.type',
                                DB::raw('count(restaurants.id) as total'))
                            ->join('districts', 'provinces.provinceid', '=', 'districts.provinceid')
                            ->join('wards', 'districts.districtid', '=', 'wards.districtid')
                            ->leftJoin('restaurants', 'restaurants.wardid', '=', 'wards.wardid')
                            // ->where('restaurants.status','=',1)
                            ->groupBy('provinces.provinceid', 'provinces.name', 'provinces.type')
                            ->orderBy('provinces.type','asc')
                            ->orderBy('provinces.name','asc')
                            ->get();

        return Response()->json([
            'data' => $provinces
        ]);
    }

    public function getProvince($provinceid)
    {
        $province = Province::where('provinceid','=',$provinceid)->first();
        return Response()->json([
            'data' => $province
        ]);
    }

    public function getDistrictsByProvince($provinceid)
    {
        $districts = District::select('districts.districtid', 'districts.name', 'districts.type',
                                'districts.location', DB::raw('count(restaurants.id) as total'))
                            ->join('wards', 'districts.districtid', '=', 'wards.districtid')
                            ->leftJoin('restaurants', 'restaurants.wardid', '=', 'wards.wardid')
                            ->where('districts.provinceid','=',$provinceid)
                            ->groupBy('districts.districtid', 'districts.name', 'districts.type',
                                'districts.location')
                            ->orderBy('districts.type','asc')
                            ->orderBy('districts.name','asc')
                            ->get();
        return Response()->json([
            'data' => $districts
        ]);
    }

    public function getDistrict($districtid)
    {
        $district = District::where('districtid','=',$districtid)->first();
        return Response()->json([
            'data' => $district
        ]);
    }

    public function getWardsByDistrict($districtid)
    {
        $wards = Ward::select('wards.wardid', 'wards.name', 'wards.type',
                        'wards.location', DB::raw('count(restaurants.id) as total'))
                    ->leftJoin('restaurants', 'restaurants.wardid', '=', 'wards.wardid')
                    ->where('wards.districtid','=',$districtid)
                    ->groupBy('wards.wardid', 'wards.name', 'wards.type', 'wards.location')
                    ->get();

        return Response()->json([
            'data' => $wards
        ]);
    }

    public function getWard($wardid)
    {
        $ward = Ward::where('wardid','=',$wardid)->first();
        return Response()->json([
            'data' => $ward
        ]);
    }

    public function getRestaurant($name, $id)
    {
        $xx = explode('id',$name)[0];
        $restaurants = Restaurant::select('restaurants.*',
                                'wards.name as ward_name','districts.name as district_name',
                                'provinces.name as province_name','categories.name as category_name')
                            ->join('wards', 'restaurants.wardid', '=', 'wards.wardid')
                            ->join('districts', 'districts.districtid', '=', 'wards.districtid')
                            ->join('provinces', 'provinces.provinceid', '=', 'districts.provinceid')
                            ->join('categories', 'categories.id', '=', 'restaurants.category_id')
                            ->where('status','=',1)
                            ->where($xx.'s.'.$name, '=', $id)->get();
        return Response()->json([
            'data' => $restaurants
        ], 200);
    }

}
