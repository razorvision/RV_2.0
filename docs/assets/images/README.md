# Documentation Images

This directory contains images used in the documentation site.

## Logo

To add the RazorVision logo:

1. Add your logo file to this directory (recommended: `razorvision-logo.png` or `razorvision-logo.svg`)
2. Recommended dimensions:
   - Width: 200-300px
   - Height: 50-80px
   - Transparent background (PNG or SVG)
3. Uncomment the `logo:` line in `docs/_config.yml`:
   ```yaml
   logo: "/assets/images/razorvision-logo.png"
   ```
4. Commit and push the changes

The logo will appear in the top-left corner of the documentation site.

## Other Images

You can add other images for documentation here and reference them in markdown:

```markdown
![Alt text](/RV_2.0/assets/images/your-image.png)
```
