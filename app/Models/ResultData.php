<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\ResultData
 *
 * @property int $id
 * @property int $result_id
 * @property string $data
 * @property-read \App\Models\Result $result
 * @method static \Illuminate\Database\Eloquent\Builder|ResultData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ResultData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ResultData query()
 * @method static \Illuminate\Database\Eloquent\Builder|ResultData whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ResultData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ResultData whereResultId($value)
 * @mixin \Eloquent
 */
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
