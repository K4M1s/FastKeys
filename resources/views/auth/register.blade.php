<x-app-layout>
    <x-container>

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('register') }}">
            @csrf

            <x-form-header>
                <h1>{{ __('Create new account') }}</h1>
            </x-form-header>

            <x-form-group>
                <x-form-label for="name" :value="__('Name')" />
                <x-form-input id="name" type="text" name="name" :value="old('name')" required autofocus />
            </x-form-group>

            <!-- Email Address -->
            <x-form-group>
                <x-form-label for="email" :value="__('Email')" />
                <x-form-input id="email" type="email" name="email" :value="old('email')" required />
            </x-form-group>

            <!-- Password -->
            <x-form-group>
                <x-form-label for="password" :value="__('Password')" />
                <x-form-input id="password" type="password" name="password" required autocomplete="new-password" />
            </x-form-group>

            <!-- Confirm Password -->
            <x-form-group>
                <x-form-label for="password_confirmation" :value="__('Confirm Password')" />
                <x-form-input id="password_confirmation" type="password" name="password_confirmation" required />
            </x-form-group>

            <x-form-footer>
                <a href="{{ route('login') }}">
                    {{ __('Already registered?') }}
                </a>

                <x-button class="button--primary" type="submit">
                    {{ __('Register') }}
                </x-button>
            </x-form-footer>
        </form>
    </x-container>
</x-app-layout>
