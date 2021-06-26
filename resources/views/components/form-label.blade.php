<label {{ $attributes->merge(['class' => 'form__label']) }}>
    {{ $value ?? $slot }}
</label>