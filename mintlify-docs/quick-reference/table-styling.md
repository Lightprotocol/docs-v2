# Table Styling in Mintlify

## Tailwind CSS Classes

Mintlify supports Tailwind CSS classes via `className` attribute in MDX tables.

### Center Alignment

Use `className="text-center"` instead of inline `style="text-align: center"`:

```html
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th className="text-center">Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
      <td className="text-center">✓</td>
    </tr>
  </tbody>
</table>
```

### Why Not Inline Styles?

Mintlify's MDX parser can reject or strip inline `style` attributes. Tailwind classes via `className` are more compatible.

### Custom Column Widths

Use the `width` attribute for custom column sizing:

```html
<th width="150">Wide Column</th>
<th width="80">Narrow Column</th>
```