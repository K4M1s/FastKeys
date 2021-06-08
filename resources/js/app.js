require('./bootstrap');
import axios from "axios";
import TypingField from "./typingField";

const showSpinner = () => {
    document.querySelector('.spinner').classList.remove('spinner--hide');
}

const hideSpinner = () => {
    document.querySelector('.spinner').classList.add('spinner--hide');
}

const typingFieldElement = document.querySelector(".typing-field");
if (typingFieldElement) {
    showSpinner();
    axios.get('/text/lorem/100').then(response => {
       window.typingField = new TypingField(typingFieldElement, response.data.text);
       hideSpinner();
    });
}