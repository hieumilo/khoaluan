<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Suggesstion;
use App\User;
use App\Restaurant;

class DashboardController extends Controller
{
    public function index()
    {
    	$user = User::count();
    	$suggesstion = Suggesstion::where('status','=',0)->count();
    	$restaurant = Restaurant::where('status','=',0)->count();
    	$restaurant1 = Restaurant::where('status','=',1)->count();

    	return Response()->json([
            'user' => $user,
            'suggesstion' => $suggesstion,
            'restaurant' => $restaurant,
            'restaurant1' => $restaurant1,
        ]);
    }
}
