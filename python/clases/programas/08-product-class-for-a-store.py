# Program 3 — Product class for a store
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class Product:
    _vat = 0.21    # class attribute — same for all products

    def __init__(self, name, price, stock=0):
        self.name = name
        self.price = price
        self.__stock = 0
        self.add_stock(stock)

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, value):
        if not value or not isinstance(value, str):
            raise ValueError('Name must be a non-empty string')
        self.__name = value.strip()

    @property
    def price(self):
        return self.__price

    @price.setter
    def price(self, value):
        if not isinstance(value, (int, float)) or value < 0:
            raise ValueError('Price must be a non-negative number')
        self.__price = round(value, 2)

    @property
    def price_with_vat(self):
        return round(self.__price * (1 + Product._vat), 2)

    @property
    def stock(self):
        return self.__stock

    def add_stock(self, quantity):
        if not isinstance(quantity, int) or quantity < 0:
            raise ValueError('Quantity must be a non-negative integer')
        self.__stock += quantity

    def sell(self, quantity=1):
        if not isinstance(quantity, int) or quantity <= 0:
            raise ValueError('Quantity must be a positive integer')
        if quantity > self.__stock:
            raise ValueError(f'Insufficient stock: {self.__stock} left')
        self.__stock -= quantity
        return self.__price * quantity

    def apply_discount(self, percentage):
        if not (0 < percentage < 100):
            raise ValueError('Discount must be between 0 and 100')
        self.__price = round(self.__price * (1 - percentage / 100), 2)

    @classmethod
    def change_vat(cls, new_vat):
        if not (0 <= new_vat <= 1):
            raise ValueError('VAT must be between 0 and 1')
        cls._vat = new_vat

    def __str__(self):
        return (f'{self.__name}: {self.__price:.2f}€ '
                f'(+VAT: {self.price_with_vat:.2f}€) — '
                f'stock: {self.__stock}')

    def __repr__(self):
        return f'Product("{self.__name}", {self.__price}, {self.__stock})'
