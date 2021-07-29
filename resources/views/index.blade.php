<x-app-layout>
    <x-container>
        <div class="homepage__main-section">
            <div class="homepage__main-section__header">
                <h1>Typing Grinder</h1>
                <p>Simple app to test and practice your typing skills</p>
            </div>

            <div class="homepage__main-section__options">
                <div class="homepage__main-section__options__header">
                    <h1>Choose what you want to play</h1>
                </div>
                <div class="homepage__main-section__option">
                    <h4>Speed Test</h4>
                    <p>Test your speed typing random heavli used english words (TOP 100)</p>
                    <a href="{{ route("game", "speedtest") }}" class="button button--primary button--outline">Start</a>
                </div>

                <div class="homepage__main-section__option">
                    <h4 class="homepage__main-section__option__title">Lorem Ipsum</h4>
                    <p class="homepage__main-section__option__description">Practice your speed and accuracy by typing random lorem ipsum words</p>
                    <a href="{{ route("game", "loremipsum") }}" class="button button--primary button--outline">Start</a>
                </div>
            </div>
        </div>
    </x-container>
</x-app-layout>