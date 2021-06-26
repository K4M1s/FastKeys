<x-app-layout>
    <x-container>

        <h1>{{ __('Verify your email address') }}</h1>

        <p>{{ __('Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn\'t receive the email, we will gladly send you another.') }}</p>

        @if (session('status') == 'verification-link-sent')
            <p>
                {{ __('A new verification link has been sent to the email address you provided during registration.') }}
            </p>
        @endif

        <div class=".auth__email-verification__footer">
            <form method="POST" action="{{ route('verification.send') }}">
                @csrf

                <x-form-footer>
                    <x-button class="button--primary" type="submit">
                        {{ __('Resend Verification Email') }}
                    </x-button>
                </x-form-footer>
            </form>

            <form method="POST" action="{{ route('logout') }}">
                @csrf

                <x-form-footer>
                    <x-button class="button--gray" type="submit">
                        {{ __('Log out') }}
                    </x-button>
                </x-form-footer>
            </form>
        </div>
    </x-container>
</x-app-layout>
