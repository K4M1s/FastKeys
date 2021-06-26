<x-app-layout>
    <x-container>
        <!-- Session Status -->
        <x-auth-session-status class="mb-4" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4" :errors="$errors" />

        <form method="POST" action="{{ route('login') }}">
            @csrf
            
            <x-form-header>
                {{ __('Login to your account') }}
            </x-form-header>
            <!-- Email Address -->
            <x-form-group>
                <x-form-label for="email" :value="__('Email')" />
                <x-form-input id="email" type="email" name="email" :value="old('email')" required autofocus />
            </x-form-group>

            <!-- Password -->
            <x-form-group>
                <x-form-label for="password" :value="__('Password')" />
                <x-form-input id="password" type="password" name="password" required autocomplete="current-password" />
            </x-form-group>

            <!-- Remember Me -->
            <x-form-group>
                <x-form-label for="remember_me" :value="__('Remember me')" />
                <x-form-checkbox id="remember_me" name="remember" />
            </x-form-group> 

            <x-form-footer>
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif

                <x-button class="button--primary" type="submit">
                    {{ __('Log in') }}
                </x-button>
            </x-form-footer>
        </form>
    </x-container>
</x-app-layout>
