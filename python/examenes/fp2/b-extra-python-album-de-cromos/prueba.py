# Simulacro práctico de FP2 · versión B · Álbum de cromos (pruebas a mano)
# Del artículo «Simulacro práctico de FP2 — programa en Python y Java aquí mismo, con nota y comentarios como en el VPL»
# https://sergiolearns.com/simulacro-examen-fp2-practica/
# PROBANDO la clase StickerAlbum (este fichero no se evalúa)
from album import StickerAlbum

mine = StickerAlbum()
for n in ("Pedri", "Alexia", "Bonmatí", "Pedri", "Yamal"):
    mine.add(n)
print(mine, len(mine))            # |->Alexia->Bonmatí->Pedri->Yamal->None 4
print(mine.add("Alexia"))         # False
print("Yamal" in mine, "Messi" in mine)   # True False
print(mine.remove("Bonmatí"))     # True
friend = StickerAlbum()
for n in ("Messi", "Yamal", "Aitana"):
    friend.add(n)
print(mine.missing_from(friend))  # |->Aitana->Messi->None
print([n.upper() for n in mine])  # ['ALEXIA', 'PEDRI', 'YAMAL']
