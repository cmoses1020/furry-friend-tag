@extends('layouts.app')

@section('content')
    <div x-data="finder" class="relative" data-img="{{ $img }}">
        <canvas 
            x-ref="canvas"
            x-on:mousedown="onPointerDown($event)"
            x-on:touchstart.passive="handleTouch($event); onPointerDown($event)"
            x-on:mouseup="onPointerUp($event)"
            x-on:touchend.passive="handleTouch($event); onPointerUp($event)"
            x-on:mousemove="onPointerMove($event)"
            x-on:touchmove.passive="handleTouch($event); onPointerMove($event)"
            x-on:wheel.passive="adjustZoom($event.deltaY*SCROLL_SENSITIVITY)"
            x-on:contextmenu.prevent="openContextMenu($event)"
        >
        </canvas>
        <div 
            x-ref="contextMenu" 
            x-show="showMenu" 
            x-cloak
            class="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            x-on:click.outside="showMenu = false"
        >
            <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Name</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Twitter Link</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Add Other Link</a>
                </li>
                <li>
                    <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Send UWUs</a>
                </li>
            </ul>
        </div>
    </div>
@endsection