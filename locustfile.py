import os
from dotenv import load_dotenv
from locust import HttpUser, task, between
import json
import base64

load_dotenv()

class ApiOrientDB(HttpUser):
    wait_time = between(1, 2)  # Задержка между запросами
    
    def on_start(self):
        # Настройка базового токена авторизации из переменных окружения
        auth_string = f"{os.getenv('REACT_APP_ATHOURIZATION_LOGIN')}:{os.getenv('REACT_APP_ATHOURIZATION_PASSWORD')}"
        self.token = base64.b64encode(auth_string.encode()).decode()

        # Настройка заголовков
        self.headers = {
            "Authorization": f"Basic {self.token}",
            "Content-Type": "application/json"
        }

        # URL частей
        self.db_name = os.getenv("REACT_APP_DB_NAME")
        self.db_url = os.getenv("REACT_APP_DB_URL")
        self.db_port = os.getenv("REACT_APP_DB_PORT")
        self.full_url = f"{self.db_url}:{self.db_port}/command/{self.db_name}/sql"
        self.auth_string = f"{os.getenv('REACT_APP_ATHOURIZATION_LOGIN')}:{os.getenv('REACT_APP_ATHOURIZATION_PASSWORD')}"
        self.token = base64.b64encode(auth_string.encode()).decode()
        self.headers = {
            "Authorization": f"Basic {self.token}",
            "Content-Type": "application/json"
        }

    @task(1)
    def get_groups(self):
        sql_command = """
            SELECT *, 
                (SELECT expand(inE()) FROM $current) as IN_EDGES, 
                (SELECT expand(outE()) FROM $current) as OUT_EDGES 
            FROM Group
        """
        body = json.dumps({ "command": sql_command })

        with self.client.post(
            url=self.full_url,
            data=body,
            headers=self.headers,
            name="getGroups"
        ) as response:
            if response.status_code != 200:
                response.failure(f"Failed with status {response.status_code}")
            # else:
            #     try:
            #         json_data = response.json()
            #         print("✅ Получен ответ от БД:", json.dumps(json_data, indent=2))
            #     except Exception as e:
            #         print("⚠️ Ошибка при разборе JSON:", e)
            #         response.failure("Ошибка при парсинге ответа")
           
    @task(1) 
    def get_users(self):
        sql_command = """
            select * from User
        """
        body = json.dumps({ "command": sql_command })

        with self.client.post(
            url=self.full_url,
            data=body,
            headers=self.headers,
            name="getUsers"
        ) as response:
            if response.status_code != 200:
                response.failure(f"Failed with status {response.status_code}")
    
    @task(1) 
    def get_elements(self):
        sql_command = """
            SELECT *, (SELECT expand(inE()) FROM $current) as IN_EDGES, (SELECT expand(outE()) FROM $current) as OUT_EDGES FROM Element
        """
        body = json.dumps({ "command": sql_command })

        with self.client.post(
            url=self.full_url,
            data=body,
            headers=self.headers,
            name="getElements"
        ) as response:
            if response.status_code != 200:
                response.failure(f"Failed with status {response.status_code}")
