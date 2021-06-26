<x-app-layout>
    <x-container>
        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            <x-form-header>
                <h1>{{ __('Recover your password') }}
            </x-form-header>

            <!-- Email Address -->
            <x-form-group>
                <x-form-label for="email" :value="__('Email')" />
                <x-form-input id="email" type="email" name="email" :value="old('email')" required autofocus />
            </x-form-group>

            <x-form-footer>
                <x-button class="button--primary" type="submit">
                    {{ __('Email Password Reset Link') }}
                </x-button>
            </x-form-footer>
        </form>
    </x-container>
</x-app-layout>
