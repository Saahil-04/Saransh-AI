@echo off

rem Start the frontend without opening a new terminal window
cd D:\Saransh-AI\frontend
start "" /B npm start dev

rem Start the backend without opening a new terminal window
cd D:\Saransh-AI\backend
start "" /B npm start run dev

rem Start the fastapi without opening a new terminal window
cd D:\Saransh-AI\python
call .\env\Scripts\activate
start "" /B  uvicorn main:app --reload

rem Exit the script
exit
