<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class District extends Model
{
    protected $table = 'districts';
    protected $guarded = [];

    public function province()
    {
        return $this->belongsTo('App\Province', 'provinceid', 'provinceid');
    }

    public function wards()
    {
        return $this->hasMany('App\Ward', 'districtid', 'districtid');
    }
}
