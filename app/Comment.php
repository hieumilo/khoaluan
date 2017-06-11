<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';
    protected $guarded = [];

    public function Images()
    {
        return $this->hasMany('App\Comment_Image');
    }
}
