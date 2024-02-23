const url = 'https://sheets.googleapis.com/v4/spreadsheets/1qCPhFOEOd8ZVJGa4Ghej40B8_-5k8G-3IgNXRs48fjg/values/工作表1!B1:F1?key=AIzaSyDR7oaMVQwAGPlFseckpAlZi2HtA0psml8';

function Notify(subtitle = '', message = '') {
    $notification.post('GetValue', subtitle, message);
};

async function getvalue() {
    return new Promise((resolve, reject) => {
        $httpClient.get(url, function (error, response, data) {
            var parse = JSON.parse(data);
            var values = parse.values[0];
            var myString = values.join('\t');
            $persistentStore.write(myString, "value");
            resolve(myString);
        });
    });
}
(async () => {
    try {
        await getvalue();
        const l_value = $persistentStore.read('value');
        Notify(
            `訂餐序號`,
            `${l_value}`
        );
    } catch (error) {
        console.error('Error:', error);
    }
    $done({});
})();
$done()