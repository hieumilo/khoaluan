<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Category;

class CategoryController extends Controller
{
	/**
	 * lấy danh sách danh mục
	 * @return [json] [danh sách danh mục]
	 */
    public function index()
    {
        $categorys = Category::all();
        return Response()->json([
            'data' => $categorys
        ]);
    }
}
