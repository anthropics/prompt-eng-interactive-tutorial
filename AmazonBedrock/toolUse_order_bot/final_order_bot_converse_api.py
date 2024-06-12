import re
import boto3
import json
from datetime import datetime
from botocore.exceptions import ClientError

session = boto3.Session()
region = session.region_name

modelId = 'anthropic.claude-3-sonnet-20240229-v1:0'

bedrock_client = boto3.client(service_name = 'bedrock-runtime', region_name = region,)

class FakeDatabase:
    def __init__(self):
        self.customers = [
            {"id": "1213210", "name": "John Doe", "email": "john@gmail.com", "phone": "123-456-7890", "username": "johndoe"},
            {"id": "2837622", "name": "Priya Patel", "email": "priya@candy.com", "phone": "987-654-3210", "username": "priya123"},
            {"id": "3924156", "name": "Liam Nguyen", "email": "lnguyen@yahoo.com", "phone": "555-123-4567", "username": "liamn"},
            {"id": "4782901", "name": "Aaliyah Davis", "email": "aaliyahd@hotmail.com", "phone": "111-222-3333", "username": "adavis"},
            {"id": "5190753", "name": "Hiroshi Nakamura", "email": "hiroshi@gmail.com", "phone": "444-555-6666", "username": "hiroshin"},
            {"id": "6824095", "name": "Fatima Ahmed", "email": "fatimaa@outlook.com", "phone": "777-888-9999", "username": "fatimaahmed"},
            {"id": "7135680", "name": "Alejandro Rodriguez", "email": "arodriguez@protonmail.com", "phone": "222-333-4444", "username": "alexr"},
            {"id": "8259147", "name": "Megan Anderson", "email": "megana@gmail.com", "phone": "666-777-8888", "username": "manderson"},
            {"id": "9603481", "name": "Kwame Osei", "email": "kwameo@yahoo.com", "phone": "999-000-1111", "username": "kwameo"},
            {"id": "1057426", "name": "Mei Lin", "email": "meilin@gmail.com", "phone": "333-444-5555", "username": "mlin"}
        ]

        self.orders = [
            {"id": "24601", "customer_id": "1213210", "product": "Wireless Headphones", "quantity": 1, "price": 79.99, "status": "Shipped"},
            {"id": "13579", "customer_id": "1213210", "product": "Smartphone Case", "quantity": 2, "price": 19.99, "status": "Processing"},
            {"id": "97531", "customer_id": "2837622", "product": "Bluetooth Speaker", "quantity": 1, "price": "49.99", "status": "Shipped"}, 
            {"id": "86420", "customer_id": "3924156", "product": "Fitness Tracker", "quantity": 1, "price": 129.99, "status": "Delivered"},
            {"id": "54321", "customer_id": "4782901", "product": "Laptop Sleeve", "quantity": 3, "price": 24.99, "status": "Shipped"},
            {"id": "19283", "customer_id": "5190753", "product": "Wireless Mouse", "quantity": 1, "price": 34.99, "status": "Processing"},
            {"id": "74651", "customer_id": "6824095", "product": "Gaming Keyboard", "quantity": 1, "price": 89.99, "status": "Delivered"},
            {"id": "30298", "customer_id": "7135680", "product": "Portable Charger", "quantity": 2, "price": 29.99, "status": "Shipped"},
            {"id": "47652", "customer_id": "8259147", "product": "Smartwatch", "quantity": 1, "price": 199.99, "status": "Processing"},
            {"id": "61984", "customer_id": "9603481", "product": "Noise-Cancelling Headphones", "quantity": 1, "price": 149.99, "status": "Shipped"},
            {"id": "58243", "customer_id": "1057426", "product": "Wireless Earbuds", "quantity": 2, "price": 99.99, "status": "Delivered"},
            {"id": "90357", "customer_id": "1213210", "product": "Smartphone Case", "quantity": 1, "price": 19.99, "status": "Shipped"},
            {"id": "28164", "customer_id": "2837622", "product": "Wireless Headphones", "quantity": 2, "price": 79.99, "status": "Processing"}
        ]

    def get_user(self, key, value):
        if key in {"email", "phone", "username"}:
            for customer in self.customers:
                if customer[key] == value:
                    return customer
            return f"Couldn't find a user with {key} of {value}"
        else:
            raise ValueError(f"Invalid key: {key}")

        return None

    def get_order_by_id(self, order_id):
        for order in self.orders:
            if order["id"] == order_id:
                return order
        return None

    def get_customer_orders(self, customer_id):
        return [order for order in self.orders if order["customer_id"] == customer_id]

    def cancel_order(self, order_id):
        order = self.get_order_by_id(order_id)
        if order:
            if order["status"] == "Processing":
                order["status"] = "Cancelled"
                return "Cancelled the order"
            else:
                return "Order has already shipped.  Can't cancel it."
        return "Can't find that order!"

toolConfig = {
  'tools': [
    {
      'toolSpec': {
        'name': 'get_user',
        'description': 'Looks up a user by email, phone, or username.',
        'inputSchema': {
          'json': {
            'type': 'object',
            'properties': {
              'key': {
                'type': 'string',
                'enum': ['email', 'phone', 'username'],
                'description': 'The attribute to search for a user by (email, phone, or username).'
              },
              'value': {
                'type': 'string',
                'description': 'The value to match for the specified attribute.'
              }
            },
            'required': ['key', 'value']
          }
        }
      }
    },
    {
      'toolSpec': {
        'name': 'get_order_by_id',
        'description': 'Retrieves the details of a specific order based on the order ID. Returns the order ID, product name, quantity, price, and order status.',
        'inputSchema': {
          'json': {
            'type': 'object',
            'properties': {
              'order_id': {
                'type': 'string',
                'description': 'The unique identifier for the order.'
              }
            },
            'required': ['order_id']
          }
        }
      }
    },
    {
      'toolSpec': {
        'name': 'get_customer_orders',
        'description': "Retrieves the list of orders belonging to a user based on a user's customer id.",
        'inputSchema': {
          'json': {
            'type': 'object',
            'properties': {
              'customer_id': {
                'type': 'string',
                'description': 'The customer_id belonging to the user'
              }
            },
            'required': ['customer_id']
          }
        }
      }
    },
    {
      'toolSpec': {
        'name': 'cancel_order',
        'description': "Cancels an order based on a provided order_id.  Only orders that are 'processing' can be cancelled",
        'inputSchema': {
          'json': {
            'type': 'object',
            'properties': {
              'order_id': {
                'type': 'string',
                'description': 'The order_id pertaining to a particular order'
              }
            },
            'required': ['order_id']
          }
        }
      }
    }
  ],
  'toolChoice': {
    'auto': {}
  }
}


db = FakeDatabase()

def process_tool_call(tool_name, tool_input):
    if tool_name == "get_user":
        return db.get_user(tool_input["key"], tool_input["value"])
    elif tool_name == "get_order_by_id":
        return db.get_order_by_id(tool_input["order_id"])
    elif tool_name == "get_customer_orders":
        return db.get_customer_orders(tool_input["customer_id"])
    elif tool_name == "cancel_order":
        return db.cancel_order(tool_input["order_id"])


def extract_reply(text):
    pattern = r'<reply>(.*?)</reply>'
    match = re.search(pattern, text, re.DOTALL)
    if match:
        return match.group(1)
    else:
        return None
    
RED = "\033[91m"
GREEN = "\033[92m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
MAGENTA = "\033[95m"
CYAN = "\033[96m"
WHITE = "\033[97m"
RESET = "\033[0m"
BOLD = "\033[1m"
UNDERLINE = "\033[4m"

def start_chat():
    system_prompt = """You are a customer support chat bot for an online retailer called TechNova. 
Your job is to help users look up their account, orders, and cancel orders.
Be helpful and brief in your responses.
You have access to a set of tools, but only use them when needed.  
If you do not have enough information to use a tool correctly, ask a user follow up questions to get the required inputs.
Do not call any of the tools unless you have the required data from a user. 
Do not make any assumptions about things like username, order id, phone number, email, etc. without explicitly asking a user to provide their information first.

In each conversational turn, you will begin by thinking about your response. Once you're done, you will write a user-facing response. It's important to place all user-facing conversational responses in <reply></reply> XML tags to make them easy to parse."""


    print(BLUE + UNDERLINE + "\nWelcome to the TechNova Customer Support" + RESET)
    print(BLUE + UNDERLINE + "========================================" + RESET)
    user_message = input(GREEN + BOLD + "\nUser: " + RESET)
    messages = [{"role": "user", "content": [{"text": user_message}]}]

    while True:
        if messages[-1].get("role") == "assistant":
            user_message = input(GREEN + BOLD + "\nUser: " + RESET)
            messages.append({"role": "user", "content": [{"text": user_message}]})

        converse_api_params = {
            "modelId": modelId,
            "system": [{"text": system_prompt}],
            "messages": messages,
            "inferenceConfig": {"maxTokens": 4096},
            "toolConfig":toolConfig,
        }

        response = bedrock_client.converse(**converse_api_params)

        if response['stopReason'] == "tool_use":
            tool_use = response['output']['message']['content'][-1]
            tool_id = tool_use['toolUse']['toolUseId']
            tool_name = tool_use['toolUse']['name']
            tool_input = tool_use['toolUse']['input']
            print(RED + BOLD + f"Claude wants to use the {tool_name} tool" + RESET)

            tool_result = process_tool_call(tool_name, tool_input)


            messages.append({"role": "assistant", "content": response['output']['message']['content']})

            #Add our tool_result message:
            messages.append({
                "role": "user",
                "content": [
                    {
                        "toolResult": {
                            "toolUseId": tool_id,
                            "content": [
                                {"text": str(tool_result)}
                            ]
                        }
                    }
                ]
            })
        else:
            # print(response.content[0].text)
            model_reply = extract_reply(response['output']['message']['content'][0]['text'])
            # print(response.content[0].text)
            # print(response)
            print(MAGENTA + BOLD + "\nTechNova Support:" + RESET + f"{model_reply}")

            messages.append({"role": "assistant", "content": response['output']['message']['content']})

start_chat()
