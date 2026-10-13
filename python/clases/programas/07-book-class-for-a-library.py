# Program 2 — Book class for a library
# Del artículo «Clases en Python — 3 programas reales con encapsulamiento y @property»
# https://sergiolearns.com/clases-en-python-practica/

class Book:
    _total_books = 0

    def __init__(self, title, author, year, isbn):
        self.title = title
        self.author = author
        self.year = year
        self.__isbn = isbn
        self.__available = True
        Book._total_books += 1

    @property
    def title(self):
        return self.__title

    @title.setter
    def title(self, value):
        if not value or not isinstance(value, str):
            raise ValueError('Title must be a non-empty string')
        self.__title = value.strip()

    @property
    def author(self):
        return self.__author

    @author.setter
    def author(self, value):
        if not value or not isinstance(value, str):
            raise ValueError('Author must be a non-empty string')
        self.__author = value.strip()

    @property
    def year(self):
        return self.__year

    @year.setter
    def year(self, value):
        if not isinstance(value, int) or value < 1000 or value > 2025:
            raise ValueError(f'Invalid year: {value}')
        self.__year = value

    @property
    def isbn(self):
        return self.__isbn    # read-only — no setter

    @property
    def available(self):
        return self.__available

    def lend(self):
        if not self.__available:
            raise ValueError(f'"{self.__title}" is already on loan')
        self.__available = False

    def return_book(self):
        if self.__available:
            raise ValueError(f'"{self.__title}" is not on loan')
        self.__available = True

    @classmethod
    def total_books(cls):
        return cls._total_books

    def __str__(self):
        status = 'available' if self.__available else 'on loan'
        return f'"{self.__title}" by {self.__author} ({self.__year}) — {status}'

    def __repr__(self):
        return f'Book("{self.__title}", "{self.__author}", {self.__year}, "{self.__isbn}")'
