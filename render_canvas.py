#!/usr/bin/env python3
"""
Centered-Column Logos with Symmetric Gradient Bands — Refined
Renders the composition spec to PNG using Pillow.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# ── Canvas ──────────────────────────────────────────────────────────────────
W, H = 1054, 734
BG = (0xF4, 0xF1, 0xEC)

canvas = Image.new("RGBA", (W, H), (*BG, 255))

FONT_DIR = "/home/tilo/.claude/skills/canvas-design/canvas-fonts"


# ── Helpers ─────────────────────────────────────────────────────────────────

def hex_to_rgba(h, opacity=1.0):
    h = h.lstrip("#")
    r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
    return (r, g, b, int(min(1.0, max(0.0, opacity)) * 255))


def lerp_color(c0, c1, t):
    """Linear interpolate between two RGBA tuples."""
    return tuple(int(c0[i] + (c1[i] - c0[i]) * t) for i in range(4))


def gradient_color_at(t, stops):
    """Get interpolated RGBA at position t (0..1) along gradient stops."""
    if t <= stops[0]["pos"]:
        return hex_to_rgba(stops[0]["color"], stops[0]["opacity"])
    if t >= stops[-1]["pos"]:
        return hex_to_rgba(stops[-1]["color"], stops[-1]["opacity"])

    for i in range(len(stops) - 1):
        s0, s1 = stops[i], stops[i + 1]
        if s0["pos"] <= t <= s1["pos"]:
            lt = (t - s0["pos"]) / max(s1["pos"] - s0["pos"], 1e-9)
            c0 = hex_to_rgba(s0["color"], s0["opacity"])
            c1 = hex_to_rgba(s1["color"], s1["opacity"])
            return lerp_color(c0, c1, lt)

    return hex_to_rgba(stops[-1]["color"], stops[-1]["opacity"])


def draw_gradient_band(img, x, y, w, h, stops, angle_deg, global_opacity=0.92):
    """Draw a horizontal linear gradient band with per-pixel precision."""
    band = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    pixels = band.load()

    for px_x in range(w):
        t = px_x / max(w - 1, 1)
        if angle_deg == 180:
            t = 1.0 - t

        r, g, b, a = gradient_color_at(t, stops)
        a = int(a * global_opacity)
        col = (r, g, b, a)

        for px_y in range(h):
            pixels[px_x, px_y] = col

    # Subtle blur per spec
    band = band.filter(ImageFilter.GaussianBlur(radius=0.5))
    img.paste(band, (x, y), band)


def draw_dashed_line(draw, x0, y0, x1, y1, color, dash_on=6, dash_off=10, width=1):
    """Draw a dashed line segment."""
    dx = x1 - x0
    dy = y1 - y0
    length = math.sqrt(dx * dx + dy * dy)
    if length < 1:
        return
    ux, uy = dx / length, dy / length
    pos = 0.0
    drawing = True
    while pos < length:
        seg = dash_on if drawing else dash_off
        seg = min(seg, length - pos)
        if drawing:
            sx = x0 + ux * pos
            sy = y0 + uy * pos
            ex = x0 + ux * (pos + seg)
            ey = y0 + uy * (pos + seg)
            draw.line([(sx, sy), (ex, ey)], fill=color, width=width)
        pos += seg
        drawing = not drawing


# ── Grid Overlay ────────────────────────────────────────────────────────────

def draw_grid(img):
    draw = ImageDraw.Draw(img)
    ml, mt, mr, mb = 26, 26, 26, 26
    rows, cols = 6, 6
    color = (0xBD, 0xB7, 0xAE, int(0.55 * 255))

    left, right = ml, W - mr
    top, bottom = mt, H - mb
    iw = right - left
    ih = bottom - top

    for i in range(rows + 1):
        y = top + int(i * ih / rows)
        draw_dashed_line(draw, left, y, right, y, color)

    for i in range(cols + 1):
        x = left + int(i * iw / cols)
        draw_dashed_line(draw, x, top, x, bottom, color)

    # Center guides (these land on grid lines for 6x6, but spec says show them)
    cx, cy = W // 2, H // 2
    draw_dashed_line(draw, cx, top, cx, bottom, color)
    draw_dashed_line(draw, left, cy, right, cy, color)


# ── Gradient Band Stops ─────────────────────────────────────────────────────

band_stops = [
    {"pos": 0.0, "color": "#A9C4F2", "opacity": 0.95},
    {"pos": 0.55, "color": "#B6CDF4", "opacity": 0.85},
    {"pos": 0.78, "color": "#E58F86", "opacity": 0.85},
    {"pos": 1.0, "color": "#F4F1EC", "opacity": 0.0},
]


def draw_bands(img):
    draw_gradient_band(img, 96, 206, 408, 246, band_stops, angle_deg=0, global_opacity=0.92)
    draw_gradient_band(img, 550, 206, 408, 246, band_stops, angle_deg=180, global_opacity=0.92)


# ── White Tiles ─────────────────────────────────────────────────────────────

def draw_tiles(img):
    draw = ImageDraw.Draw(img)
    draw.rectangle([456, 92, 456 + 141, 92 + 141], fill=(255, 255, 255, 255))
    draw.rectangle([456, 442, 456 + 141, 442 + 141], fill=(255, 255, 255, 255))


# ── Logo X Mark (refined) ──────────────────────────────────────────────────

def draw_x_mark(img):
    """Stylized X with sharp terminals — refined with anti-aliased rendering."""
    # Render at 4x then downscale for clean anti-aliasing
    scale = 4
    mark_w, mark_h = 84, 92
    big_w, big_h = mark_w * scale, mark_h * scale

    big = Image.new("RGBA", (big_w, big_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(big)

    stroke_w = 14 * scale
    hw = stroke_w / 2

    # Diagonal 1: top-left to bottom-right
    d_len = math.sqrt(big_w ** 2 + big_h ** 2)
    ux, uy = big_w / d_len, big_h / d_len
    px, py = -uy, ux

    x0, y0 = 0, 0
    x1, y1 = big_w, big_h

    draw.polygon([
        (x0 + px * hw, y0 + py * hw),
        (x0 - px * hw, y0 - py * hw),
        (x1 - px * hw, y1 - py * hw),
        (x1 + px * hw, y1 + py * hw),
    ], fill=(0x11, 0x11, 0x11, 255))

    # Diagonal 2: top-right to bottom-left
    x2, y2 = big_w, 0
    x3, y3 = 0, big_h
    ux2, uy2 = -big_w / d_len, big_h / d_len
    px2, py2 = -uy2, ux2

    draw.polygon([
        (x2 + px2 * hw, y2 + py2 * hw),
        (x2 - px2 * hw, y2 - py2 * hw),
        (x3 - px2 * hw, y3 - py2 * hw),
        (x3 + px2 * hw, y3 + py2 * hw),
    ], fill=(0x11, 0x11, 0x11, 255))

    # Downscale with high-quality resampling
    mark = big.resize((mark_w, mark_h), Image.LANCZOS)
    img.paste(mark, (486, 118), mark)


# ── Connector Group (refined) ──────────────────────────────────────────────

def draw_connector(img):
    """Center connector: white slot, twin red bars, gradient bridge."""
    # White slot
    slot = Image.new("RGBA", (44, 206), (255, 255, 255, 255))
    img.paste(slot, (505, 234), slot)

    # Red bars — render at 2x for cleaner blur edges
    def make_red_bar():
        scale = 2
        bw, bh = 18 * scale, 198 * scale
        bar = Image.new("RGBA", (bw, bh), hex_to_rgba("#E08A83", 0.9))
        bar = bar.filter(ImageFilter.GaussianBlur(radius=1.0 * scale))
        # Apply 0.85 opacity
        pixels = bar.load()
        for x in range(bw):
            for y in range(bh):
                r, g, b, a = pixels[x, y]
                pixels[x, y] = (r, g, b, int(a * 0.85))
        return bar.resize((18, 198), Image.LANCZOS)

    bar_l = make_red_bar()
    bar_r = make_red_bar()
    img.paste(bar_l, (492, 238), bar_l)
    img.paste(bar_r, (544, 238), bar_r)

    # Horizontal bridge with gradient
    bridge_w, bridge_h = 70, 58
    bridge_stops = [
        {"pos": 0.0, "color": "#E08A83", "opacity": 0.75},
        {"pos": 0.5, "color": "#B59AD0", "opacity": 0.85},
        {"pos": 1.0, "color": "#E08A83", "opacity": 0.75},
    ]

    bridge = Image.new("RGBA", (bridge_w, bridge_h), (0, 0, 0, 0))
    pixels = bridge.load()
    for px_x in range(bridge_w):
        t = px_x / max(bridge_w - 1, 1)
        r, g, b, a = gradient_color_at(t, bridge_stops)
        a = int(a * 0.9)  # global opacity
        for px_y in range(bridge_h):
            pixels[px_x, px_y] = (r, g, b, a)

    bridge = bridge.filter(ImageFilter.GaussianBlur(radius=0.6))
    img.paste(bridge, (492, 310), bridge)


# ── Starburst Mark (refined — soft rounded spokes) ─────────────────────────

def draw_starburst(img):
    """Radial starburst with 13 rounded spokes, soft ends. Rendered at 4x."""
    scale = 4
    box_size = 64
    big_size = box_size * scale
    cx = big_size // 2
    cy = big_size // 2

    big = Image.new("RGBA", (big_size, big_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(big)

    color = hex_to_rgba("#C77456", 1.0)
    num_spokes = 13
    outer_r = 28 * scale
    inner_r = 9 * scale
    spoke_half_w_base = 4.0 * scale
    spoke_half_w_tip = 1.8 * scale

    # Central disk
    draw.ellipse(
        [cx - inner_r, cy - inner_r, cx + inner_r, cy + inner_r],
        fill=color,
    )

    # Spokes as smooth tapered shapes
    for i in range(num_spokes):
        angle = (2 * math.pi * i) / num_spokes - math.pi / 2

        cos_a = math.cos(angle)
        sin_a = math.sin(angle)
        perp_x = -sin_a
        perp_y = cos_a

        # Base point (just inside the disk edge)
        base_dist = inner_r * 0.65
        bx = cx + cos_a * base_dist
        by = cy + sin_a * base_dist

        # Tip point
        tx = cx + cos_a * outer_r
        ty = cy + sin_a * outer_r

        # Mid point for curvature
        mid_dist = (base_dist + outer_r) * 0.55
        mx = cx + cos_a * mid_dist
        my = cy + sin_a * mid_dist

        # Draw spoke as a polygon with tapered width
        # Base width -> mid width -> tip width
        mid_half = spoke_half_w_base * 0.7

        poly = [
            (bx + perp_x * spoke_half_w_base, by + perp_y * spoke_half_w_base),
            (mx + perp_x * mid_half, my + perp_y * mid_half),
            (tx + perp_x * spoke_half_w_tip, ty + perp_y * spoke_half_w_tip),
            (tx - perp_x * spoke_half_w_tip, ty - perp_y * spoke_half_w_tip),
            (mx - perp_x * mid_half, my - perp_y * mid_half),
            (bx - perp_x * spoke_half_w_base, by - perp_y * spoke_half_w_base),
        ]
        draw.polygon(poly, fill=color)

        # Rounded tip: small circle at spoke end
        tip_r = spoke_half_w_tip * 1.1
        draw.ellipse(
            [tx - tip_r, ty - tip_r, tx + tip_r, ty + tip_r],
            fill=color,
        )

    # Downscale for anti-aliased smoothness
    mark = big.resize((box_size, box_size), Image.LANCZOS)
    img.paste(mark, (495, 485), mark)


# ── Assemble (correct z-order) ──────────────────────────────────────────────

# 1. Gradient bands (lowest)
draw_bands(canvas)

# 2. Grid overlay (above bands, below tiles)
draw_grid(canvas)

# 3. White tiles (above bands)
draw_tiles(canvas)

# 4. Connector (sits between tiles, above bands)
draw_connector(canvas)

# 5. Logo marks (topmost)
draw_x_mark(canvas)
draw_starburst(canvas)

# ── Export ───────────────────────────────────────────────────────────────────

out_path = "/home/tilo/Workspace/docs-main-reorder/symmetric-convergence.png"

# Flatten RGBA to RGB against the background
flat = Image.new("RGB", (W, H), BG)
flat.paste(canvas, (0, 0), canvas)
flat.save(out_path, "PNG", dpi=(144, 144))

print(f"Saved: {out_path}")
print(f"Size: {W}x{H}px")
