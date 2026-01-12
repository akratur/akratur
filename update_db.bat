@echo off
echo Veritabani istemcisi guncelleniyor (Prisma Generate)...
cd /d "%~dp0"
call npx prisma generate
echo.
echo Islem basariyla tamamlandi!
echo Simdi 'npm run dev' komutu ile server'i tekrar baslatabilirsiniz.
pause
