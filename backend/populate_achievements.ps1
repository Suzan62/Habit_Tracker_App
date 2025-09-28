# PowerShell script to populate sample achievements
# Make sure PostgreSQL is running and psql is in your PATH

$connectionString = "postgresql://postgres:root@localhost:5432/HabitTrackerDB"
$sqlFile = "sample_achievements.sql"

if (Test-Path $sqlFile) {
    Write-Host "Executing sample achievements SQL script..." -ForegroundColor Green
    psql $connectionString -f $sqlFile
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Sample achievements populated successfully!" -ForegroundColor Green
    } else {
        Write-Host "Error executing SQL script. Make sure PostgreSQL is running and accessible." -ForegroundColor Red
    }
} else {
    Write-Host "SQL file not found: $sqlFile" -ForegroundColor Red
}
