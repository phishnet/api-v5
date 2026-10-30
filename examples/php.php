<?php
// Usage: PHISHNET_API_KEY=your_key php examples/php.php
$ch = curl_init('https://api.phish.net/v5/setlists/showdate/1997-11-22.json');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['X-API-KEY: ' . getenv('PHISHNET_API_KEY')],
]);
$body = curl_exec($ch);
if (curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {
    exit("Request failed: $body\n");
}
foreach (json_decode($body, true)['data'] as $row) {
    echo "Set {$row['set']}: {$row['song']}{$row['trans_mark']}\n";
}
