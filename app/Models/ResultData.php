<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResultData extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'data'
    ];

    public function result()
    {
        return $this->belongsTo(Result::class);
    }
}
