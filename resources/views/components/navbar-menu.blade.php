<nav class="navbar__menu">
    <div class="navbar__menu-item">
        <a href="{{ route('game', 'speedtest') }}">Speed Test</a>
    </div>
    
    <div class="navbar__menu-item">
        <a href="{{ route('game', 'loremipsum') }}">Lorem Ipsum game</a>
    </div>

    {{-- <div class="navbar__user-links">
        @if(Auth::check())
            <div class="navbar__user">
                <span class="navbar__user__name">{{Auth::user()->name}}</span>
                <div class="navbar__user__menu">
                    <form action="{{route('logout')}}" method="POST" class="navbar__user__menu__item">
                        @csrf
                        <button type="submit" class="navbar__user__menu__item__link">Log out</button>
                    </form>
                </div>
            </div>
        @else
            <a href="{{route('login')}}" class="button button--primary button--outline">Log in</a>
            <a href="{{route('register')}}" class="button button--primary">Register</a>
        @endif
    </div> --}}
</nav>