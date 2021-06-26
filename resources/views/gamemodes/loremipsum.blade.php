<x-app-layout>
    <x-container>
        <div class="typing-field__wrapper">
            <x-typing-field/>
            <x-user-inferface />
        </div>
    </x-container>
    <script>
        window.onload = function() {
            initGame('loremipsum');
        }
    </script>
</x-app-layout>