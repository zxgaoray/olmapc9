@set NODE_PATH=C:\Program Files\nodejs\npm
@echo %PATH% | find "Node.js" 
@if %errorlevel% == 1 set PATH=%PATH%;%NODE_PATH% 
@rem @echo %cd%
@node D:\workspace\js\olmap\bin\www