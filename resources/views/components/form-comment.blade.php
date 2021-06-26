<label {{ $attributes->merge(['class' => 'form__comment']) }}>
    {{ $value ?? $slot }}
</label>