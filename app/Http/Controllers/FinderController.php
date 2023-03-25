<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Vite;

class FinderController extends Controller
{
    public function __invoke()
    {
        $img = Vite::asset('resources/images/AC_2022_full.jpg');

        return view('finder')
            ->with('img', $img);
    }
}
