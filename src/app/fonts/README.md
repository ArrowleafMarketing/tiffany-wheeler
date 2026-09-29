# Fonts

`fraunces-soft-latin.woff2` is **Fraunces** by Undercase Type (Phaedra Charles and Flavia Zimbardi), licensed under the [SIL Open Font License 1.1](https://openfontlicense.org). It is a static instance of the Google Fonts latin subset, pinned to the one look the site uses:

| Axis | Value |
|---|---|
| `SOFT` | 100 |
| `WONK` | 0 |
| `opsz` | 40 |
| `wght` | 100–900 (still variable) |

That brings the file from 121 KB down to 37 KB, which matters for first-visit LCP on phones.

To regenerate it, take the variable latin woff2 from Google Fonts (or from `.next/static/media` after a build that uses `next/font/google` Fraunces with all axes) and run:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
f = TTFont("fraunces-latin-variable.woff2")
inst = instancer.instantiateVariableFont(f, {"SOFT": 100, "WONK": 0, "opsz": 40})
inst.flavor = "woff2"
inst.save("fraunces-soft-latin.woff2")
```

Figtree and Caveat still load through `next/font/google`, which self-hosts them at build time.
