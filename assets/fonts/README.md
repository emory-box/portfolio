# Self-hosted fonts

All website font requests use local files. Preserve the accompanying SIL Open
Font License files when distributing them.

| Scope | Files | License |
| --- | --- | --- |
| Shared Latin text | `inter-latin.woff2`, `nunito-latin.woff2` | `Inter-OFL.txt`, `Nunito-OFL.txt` |
| Greeny Vietnamese case study | `inter-vietnamese.woff2`, `nunito-vietnamese.woff2` | Same Inter/Nunito licenses |
| Illustrated Home | `montserrat-latin.woff2`, `reddit-sans-latin.woff2`, `roboto-latin.woff2` | `Montserrat-OFL.txt`, `RedditSans-OFL.txt`, `Roboto-OFL.txt` |

Shared families are declared in `assets/css/fonts.css`. Greeny's private
Vietnamese aliases are scoped in its case-study stylesheet. Home's families
are declared in `assets/css/home.css`: Montserrat100–900, Reddit Sans300–900
and Roboto400. Home text follows its current UI kit.

The Vietnamese subsets were downloaded from the official Google Fonts CSS
API on2026-11-07 (Inter v20, Nunito v32); Home files came from the same API.
License sources are the corresponding `ofl/<family>/OFL.txt` files in
[google/fonts](https://github.com/google/fonts).
