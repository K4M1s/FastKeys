<x-app-layout>
    <x-container>
        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('password.update') }}">
            @csrf

            <x-form-header>
                <h1>{{ __('Reset your password') }}
            </x-form-header>

            <!-- Password Reset Token -->
            <input type="hidden" name="token" value="{{ $request->route('token') }}">

            <!-- Email Address -->
            <x-form-group>
                <x-form-label for="email" :value="__('Email')" />
                <x-form-input id="email" type="email" name="email" :value="old('email', $request->email)" required autofocus />
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
                <x-button class="button--primary" type="submit">
                    {{ __('Reset Password') }}
                </x-button>
            </x-form-footer>
        </form>
    </x-container>
</x-app-layout>
