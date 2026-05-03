from PIL import Image

img = Image.open('../public/logo.png').convert('RGBA')
pixels = img.load()

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        # F8F5F0 background instead of white
        if r > 230 and g > 230 and b > 230:
            pixels[x, y] = (248, 245, 240, 255)
        # Orange to Terracotta
        elif r > 150 and g < 200 and b < 100 and a > 50:
            pixels[x, y] = (196, 98, 45, 255)

img.save('../public/logo.png')
print("Logo updated successfully!")
