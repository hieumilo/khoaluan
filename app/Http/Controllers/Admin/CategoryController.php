<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Category;
use Validator;
use DateTime;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $categories = Category::all();
        return Response()->json([
            'data' => $categories
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
        $rules = [
        	'name' => 'required|unique:categories,name'
        ];
        $messages = [
		    'name.required' => 'Tên danh mục không được để trống',
		    'name.unique' => 'Tên danh mục đã tồn tại'
		];
		$validator = Validator::make($request->all(), $rules, $messages);
        // dd($validator->fails());
        if ($validator->fails()) {
            return Response()->json([
                'message' => 'Thêm mới danh mục không thành công',
                'error' => $validator->messages()
            ], 422);
        }

        $category = new Category;
        $category->name = $request->name;
        $category->slug = str_slug($request->name, '-');
        $category->created_at = new DateTime();
        $category->save();

        return Response()->json([
            'message' => 'Thêm mới danh mục thành công',
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $category = Category::find($id);
        return Response()->json([
            'data' => $category
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
        $rules = [
            'name' => 'required|unique:categories,name,'.$id
        ];
        $messages = [
            'name.required' => 'Tên danh mục không được để trống',
            'name.unique' => 'Tên danh mục đã tồn tại'
        ];
        $validator = Validator::make($request->all(), $rules, $messages);
        if ($validator->fails()) {
            return Response()->json([
                'message' => 'Cập nhật danh mục không thành công',
                'error' => $validator->messages()
            ], 422);
        }
             
        $category = Category::where('id',$id)->first();
        $category->name = $request->name;
        $category->slug = str_slug($request->name,"-");
        $category->updated_at = new DateTime();
        $category->save();
        
        return Response()->json([
            'message' => 'Cập nhật danh mục thành công'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Category::find($id)->delete();
        return Response()->json([
            'message' => 'Xóa danh mục thành công',
        ], 200);
    }
}
