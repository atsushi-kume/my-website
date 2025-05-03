# click_all_banner.ps1
$content = Invoke-WebRequest -Uri 'http://localhost:9222/json' -UseBasicParsing
$json = $content.Content | ConvertFrom-Json
$tabId = $json[0].id

$js = @"
(async () => {
    const units = document.querySelectorAll('.banner .unit a');
    for (let i = 0; i < units.length; i++) {
        units[i].click();
        await new Promise(r => setTimeout(r, 3000));
    }
})();
"@

Invoke-RestMethod -Uri "http://localhost:9222/session/$tabId/runtime/evaluate" -Method POST -ContentType 'application/json' -Body (@{ expression = $js } | ConvertTo-Json -Compress)
