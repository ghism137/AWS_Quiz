$lines = Get-Content 'c:\Users\Admin\AWS\aws-cloud-quiz1.html'
$qdata = $lines[526..786] -join "`n"
$qheader = "// AWS Quiz Questions Data`n// Do NOT edit manually - append to ALL_Q array to add questions`n`n"
[System.IO.File]::WriteAllText('c:\Users\Admin\AWS\data\questions.js', $qheader + $qdata, [System.Text.Encoding]::UTF8)
Write-Host "questions.js done - $((Get-Item 'c:\Users\Admin\AWS\data\questions.js').Length) bytes"

$sdata = $lines[788..1022] -join "`n"
$sheader = "// AWS Study Data`n// STUDY_DATA: detailed notes per topic`n// TOPIC_CONNECTIONS: knowledge graph links`n`n"
[System.IO.File]::WriteAllText('c:\Users\Admin\AWS\data\study-data.js', $sheader + $sdata, [System.Text.Encoding]::UTF8)
Write-Host "study-data.js done - $((Get-Item 'c:\Users\Admin\AWS\data\study-data.js').Length) bytes"
