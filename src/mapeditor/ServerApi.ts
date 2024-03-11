export class ServerApi {
    public static saveRawMaps(rawMaps: {[key: string]: string}) {
        fetch('http://127.0.0.1:4200/', {
            method: 'POST',
            body: JSON.stringify(rawMaps),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            }
        })
        .then((response) => response.json())
        .then((json) => console.log(json));
    }
}