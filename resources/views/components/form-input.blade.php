@props(['disabled' => false])

<input {{$disabled ? 'disabled' : ''}} {!! $attributes->merge(['class' => 'form__control']) !!}>