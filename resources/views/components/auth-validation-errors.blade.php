@props(['errors'])

@if ($errors->any())
    <div {{ $attributes->merge(['class' => 'auth__errors']) }}>
        <div class="auth__errors__header">
            {{ __('Whoops! Something went wrong.') }}
        </div>

        <ul class="auth__errors__content">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
