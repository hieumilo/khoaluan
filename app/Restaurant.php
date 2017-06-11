<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $table = 'restaurants';
    protected $guarded = [];

    public function Foods()
    {
        return $this->hasMany('App\Food');
    }

    public function Category()
    {
        return $this->belongsTo('App\Category');
    }

    public function User()
    {
        return $this->belongsTo('App\User');
    }

    public function Ward()
    {
        return $this->belongsTo('App\Ward', 'wardid', 'wardid');
    }
}
