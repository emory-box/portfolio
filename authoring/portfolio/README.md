# Portfolio authoring

These optional Node helpers export static HTML. GitHub Pages and visitors do
not run them.

| Location | Responsibility |
| --- | --- |
| `content.cjs` | Supplied profile, project metadata, Home summaries and skill lists |
| `chrome.cjs` | Case-study recommendations, personal footer and Greeny credits |
| `home/` | Illustrated Home template, asset registry and artwork helpers |
| `build.cjs` | Export Home and optionally synchronize marked project endings |

From the repository root:

```powershell
node authoring/portfolio/build.cjs --home-only
node authoring/portfolio/build.cjs
```

Use `--home-only` for Home changes. The full command also updates only the
marked ending/footer fragments of the three case studies. Project interiors
and the Greeny model are outside this builder.

Read [Home authoring](home/README.md), [the Home specification](../../docs/home/spec.md)
or [shared website rules](../../docs/shared/website-spec.md) for the task at hand.
Unknown role, LinkedIn, CV and other personal facts remain explicit placeholders
in `content.cjs`; the supplied name/email and genuine project links stay intact.
