<div class="navbar">
    <div class="navbar__container">
        <div class="navbar__logo">
            <a href="{{ route('index') }}" class="navbar__link">{{ config('app.name') }}</a>
        </div>

        <x-navbar-menu />
        <x-hamburger />
    </div>
</div>