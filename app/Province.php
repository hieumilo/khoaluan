<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $table = 'provinces';
    protected $guarded = [];

    public function districts()
    {
        return $this->hasMany('App\District', 'provinceid', 'provinceid');
    }
}
