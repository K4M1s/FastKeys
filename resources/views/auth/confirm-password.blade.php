<x-app-layout>
    <x-container>
        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('password.confirm') }}">
            @csrf

            <x-form-header>
                <h1>{{ __('Confirm your password') }}</h1>
            </x-form-header>

            <!-- Password -->
            <x-form-group>
                <x-form-label for="password" :value="__('Password')" />
                <x-form-input id="password" type="password" name="password" required autocomplete="current-password" />
            </x-form-group>

            <x-form-footer>
                <x-button class="button--primary" type="submit">
                    {{ __('Confirm') }}
                </x-button>
            </x-form-footer>
        </form>
    </x-container>
</x-app-layout>
