$log = "$PSScriptRoot\..\run-logs\dns_poll.log"
New-Item -Path (Split-Path $log) -ItemType Directory -Force | Out-Null
"=== DNS poll started at $(Get-Date -Format o) ===" | Out-File $log -Append
$count = 0
$maxCount = 10 # 循环 10 次
while ($count -lt $maxCount) {
  $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "---- $ts ----" | Out-File $log -Append
  try {
    Resolve-DnsName meishitiandi.dpdns.org -Type CNAME -Server 1.1.1.1 -ErrorAction Stop | Out-File $log -Append
  } catch {
    "CNAME lookup error: $($_.Exception.Message)" | Out-File $log -Append
  }
  try {
    Resolve-DnsName meishitiandi.dpdns.org -Type A -Server 1.1.1.1 -ErrorAction Stop | Out-File $log -Append
  } catch {
    "A lookup error: $($_.Exception.Message)" | Out-File $log -Append
  }
  try {
    $r = Invoke-WebRequest -Uri "https://meishitiandi.dpdns.org/" -Method Head -UseBasicParsing -TimeoutSec 30
    "meishitiandi response: $($r.StatusCode) $($r.StatusDescription)" | Out-File $log -Append
  } catch {
    "meishitiandi web error: $($_.Exception.Message)" | Out-File $log -Append
  }
  try {
    $r2 = Invoke-WebRequest -Uri "https://liu474751-tech.github.io/tasty-kitchen/" -Method Head -UseBasicParsing -TimeoutSec 30
    "github.io response: $($r2.StatusCode) $($r2.StatusDescription)" | Out-File $log -Append
  } catch {
    "github.io web error: $($_.Exception.Message)" | Out-File $log -Append
  }
  Start-Sleep -Seconds 120
  $count++
}
"=== DNS poll finished at $(Get-Date -Format o) ===" | Out-File $log -Append

