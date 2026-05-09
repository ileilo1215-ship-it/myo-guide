from PIL import Image
import os

def fix_logo(input_path, output_path, target_color=(248, 245, 240)):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return

    print(f"Processing {input_path}...")
    img = Image.open(input_path).convert('RGBA')
    pixels = img.load()

    width, height = img.size
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # If the pixel is semi-transparent or part of the "fake transparency" grid
            # Usually fake transparency grids are white/light grey.
            # We want to replace anything that is not "logo" (black/dark) with the target color.
            
            # Calculate intensity
            intensity = (r + g + b) / 3
            
            # If intensity is high (bright), it's background
            if intensity > 150: # Adjust threshold to keep the logo details
                # Replace with target background color, full opacity
                pixels[x, y] = (target_color[0], target_color[1], target_color[2], 255)
            else:
                # Keep original dark pixel (the logo) but make it fully opaque to avoid alpha issues
                # Or keep alpha if it's intended to be semi-transparent black (though logo is usually solid)
                pixels[x, y] = (r, g, b, 255)

    img.save(output_path, 'PNG')
    print(f"Saved fixed logo to {output_path}")

# Run for both original and compressed if they exist
fix_logo('public/logo-v3.png', 'public/logo-v3-fixed.png')
fix_logo('public/logo-v3-compressed.png', 'public/logo-v3-compressed-fixed.png')
