<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Food_Image extends Model
{
    protected $table = 'food_images';
    protected $guarded = [];

    public function Food()
    {
        return $this->belongsTo('App\Food');
    }
}
