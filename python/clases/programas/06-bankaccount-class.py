# Program 1 — BankAccount class
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class BankAccount:
    _total_accounts = 0

    def __init__(self, holder, initial_balance=0):
        if not holder or not isinstance(holder, str):
            raise ValueError('Holder must be a non-empty string')
        self.__holder = holder
        self.__balance = 0
        self.__transactions = []
        self.balance = initial_balance
        BankAccount._total_accounts += 1

    @property
    def holder(self):
        return self.__holder

    @property
    def balance(self):
        return self.__balance

    @balance.setter
    def balance(self, value):
        if not isinstance(value, (int, float)):
            raise TypeError('Balance must be numeric')
        if value < 0:
            raise ValueError('Initial balance cannot be negative')
        self.__balance = value

    @property
    def transactions(self):
        return list(self.__transactions)

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError('Deposit amount must be positive')
        self.__balance += amount
        self.__transactions.append(f'+{amount:.2f}€')

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError('Withdrawal amount must be positive')
        if amount > self.__balance:
            raise ValueError(f'Insufficient funds: you have {self.__balance:.2f}€')
        self.__balance -= amount
        self.__transactions.append(f'-{amount:.2f}€')

    @classmethod
    def total_accounts(cls):
        return cls._total_accounts

    def __str__(self):
        return f'{self.__holder}\'s account: {self.__balance:.2f}€'

    def __repr__(self):
        return f'BankAccount("{self.__holder}", {self.__balance})'

a1 = BankAccount('Sergio', 1000)
a1.deposit(250)
a1.withdraw(100)
print(a1)                               # → Sergio's account: 1150.00€
print(a1.transactions)                  # → ['+250.00€', '-100.00€']
print(BankAccount.total_accounts())     # → 1
