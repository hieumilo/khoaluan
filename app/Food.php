<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    protected $table = 'foods';
    protected $guarded = [];

    public function Images()
    {
        return $this->hasMany('App\Food_Image');
    }
}
