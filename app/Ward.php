<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    protected $table = 'wards';
    protected $guarded = [];

    public function District()
    {
        return $this->belongsTo('App\District', 'districtid', 'districtid');
    }

    public function Restaurants()
    {
        return $this->hasMany('App\Restaurant', 'wardid', 'wardid');
    }
}
