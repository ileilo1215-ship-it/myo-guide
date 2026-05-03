from PIL import Image

img = Image.open('../public/logo.png').convert('RGBA')
pixels = img.load()

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        
        # Aggressively remove white/beige backgrounds
        if r > 210 and g > 210 and b > 210:
            pixels[x, y] = (255, 255, 255, 0)
        # Ensure orange is Terracotta
        elif r > 150 and g < 200 and b < 100:
            pixels[x, y] = (196, 98, 45, 255)

img.save('../public/logo-transparent.png', 'PNG')
print("New logo saved as logo-transparent.png")
