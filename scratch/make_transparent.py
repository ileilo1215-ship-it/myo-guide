from PIL import Image

img = Image.open('../public/logo.png').convert('RGBA')
pixels = img.load()

# F8F5F0 is roughly 248, 245, 240
# White is 255, 255, 255
# We will make anything close to white or F8F5F0 transparent.
# To avoid hard halos, we can scale the alpha based on lightness.

for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = pixels[x, y]
        
        # Calculate lightness/intensity
        intensity = (r + g + b) / 3
        
        # If it's very bright (background), make it transparent
        if intensity > 230:
            pixels[x, y] = (255, 255, 255, 0)
        # If it's kinda bright (halo edges), make it semi-transparent
        elif intensity > 200:
            # Scale alpha: intensity 200 -> alpha 255, intensity 230 -> alpha 0
            new_alpha = int(255 * (230 - intensity) / 30)
            pixels[x, y] = (r, g, b, new_alpha)

img.save('../public/logo.png', 'PNG')
print("Logo is now perfectly transparent!")
