import axios from "axios"

export default class ResultManager {
    async save(result) {

        const formdata = new FormData();

        formdata.append('speed', result.speed)
        formdata.append('accuracy', result.accuracy)
        formdata.append('gamemode', result.game)
        formdata.append('gamedata', result.data)

        const response = await axios({
            method: "POST",
            url: "/result",
            headers: { "Content-Type": "multipart/form-data" },
            data: formdata
        }).catch(err => {
            return false;
        })

        console.log(response);

        return true;
    }
}