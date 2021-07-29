<x-app-layout>
    <x-container>
        <div class="typing-field__wrapper"></div>
        <x-result-table />
    </x-container>
    <script>
        window.onload = function() {
            initGame('loremipsum');
        }
    </script>
</x-app-layout>