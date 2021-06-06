require('./bootstrap');
import TypingField from "./typingField";

const typingFieldElement = document.querySelector(".typing-field");
if (typingFieldElement) {
    window.typingField = new TypingField(typingFieldElement);
}
