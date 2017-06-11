<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment_Image extends Model
{
    protected $table = 'comment_images';
    protected $guarded = [];

    public function Comment()
    {
        return $this->belongsTo('App\Comment');
    }

}
