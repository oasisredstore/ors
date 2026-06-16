import os
import urllib.request
import json
import time

# Dossier de destination pour les images
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'images', 'timimoun')

# Créer le dossier s'il n'existe pas
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Liste des images (placeholders de haute qualité depuis Unsplash, adaptés au thème)
# Note: Dans un scénario réel, on utiliserait BeautifulSoup ou un appel API Unsplash
images_to_download = [
    {
        "filename": "timimoun_oasis_sunset.webp",
        "url": "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1200&auto=format&fit=crop", # Desert Sunset
        "description": "Coucher de soleil sur l'Erg"
    },
    {
        "filename": "timimoun_ksar_architecture.webp",
        "url": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop", # Clay architecture
        "description": "Architecture en toub"
    },
    {
        "filename": "timimoun_artisan_craft.webp",
        "url": "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1200&auto=format&fit=crop", # Pottery/Crafts
        "description": "Artisanat traditionnel"
    },
    {
        "filename": "timimoun_palmeraie.webp",
        "url": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop", # Oasis / Palm trees
        "description": "Palmeraie de Timimoun"
    },
    {
        "filename": "timimoun_market.webp",
        "url": "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop", # Market / Spices
        "description": "Marché local"
    }
]

def download_images():
    print(f"Téléchargement des images vers {OUTPUT_DIR}...")
    for img in images_to_download:
        filepath = os.path.join(OUTPUT_DIR, img['filename'])
        if os.path.exists(filepath):
            print(f"[SKIP] {img['filename']} existe déjà.")
            continue
            
        try:
            print(f"[DOWNLOAD] Récupération de {img['filename']}...")
            urllib.request.urlretrieve(img['url'], filepath)
            print(f"  -> Succès: {filepath}")
            time.sleep(1) # Pause polie entre les requêtes
        except Exception as e:
            print(f"  -> ERREUR lors du téléchargement de {img['filename']}: {e}")
            
    print("Terminé!")

if __name__ == "__main__":
    download_images()
