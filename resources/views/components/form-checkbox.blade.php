<label class="form__checkbox">
    {{ $value ?? '' }}
    <input type="checkbox" {!! $attributes->merge(['class' => 'form__checkbox__input']) !!}>
    <span class="form__checkbox__checkmark"></span>
</label>