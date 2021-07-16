import axios from "axios"
import Result from "./Result";

export default class ResultManager {
    public static save(result: Result) {
        return new Promise(async (resolve, reject) => {
            console.log(result);

            const formdata = new FormData();

            for (const [key, value] of Object.entries(result)) {
                formdata.append(key, String(value));
            }

            axios({
                method: "POST",
                url: "/result",
                headers: { "Content-Type": "multipart/form-data" },
                data: formdata
            })
            .then(resolve)
            .catch(reject);
        });
    }
}