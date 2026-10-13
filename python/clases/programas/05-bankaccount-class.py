# Program 1 — BankAccount class
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class BankAccount:
    def __init__(self, holder, initial_balance=0):
        self.holder = holder
        self.balance = initial_balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        self.balance -= amount    # allows negative balance — problem

    def __str__(self):
        return f'{self.holder}\'s account: {self.balance:.2f}€'

account = BankAccount('Sergio', 1000)
account.balance = -999999    # anyone can manipulate balance directly
