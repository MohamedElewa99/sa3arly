"""Convert the Sa3arly design file (.dc.html) into a React component.

The design canvas format is HTML with {{ path }} holes, <sc-if> and <sc-for>, and a logic class.
This keeps the design file as the single source of truth: edit the design, re-run this script.

usage: python tools/dc2jsx.py <design.dc.html> <out_dir>
writes <out_dir>/App.jsx and <out_dir>/app.css
"""
from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

VOID = {"input", "br", "img", "meta", "link", "hr"}
ATTR = {
    "class": "className", "for": "htmlFor", "autocomplete": "autoComplete", "inputmode": "inputMode",
    "tabindex": "tabIndex", "readonly": "readOnly", "maxlength": "maxLength", "viewbox": "viewBox",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
    "stroke-dasharray": "strokeDasharray", "text-anchor": "textAnchor", "font-size": "fontSize",
    "font-family": "fontFamily", "font-weight": "fontWeight", "fill-rule": "fillRule", "clip-rule": "clipRule",
    "onclick": "onClick", "onchange": "onChange", "onkeydown": "onKeyDown", "oninput": "onInput",
    "onpointerdown": "onPointerDown", "onpointermove": "onPointerMove", "onpointerup": "onPointerUp",
    "onpointerleave": "onPointerLeave", "onmousemove": "onMouseMove", "onmouseleave": "onMouseLeave",
    "onmousedown": "onMouseDown", "onmouseup": "onMouseUp", "spellcheck": "spellCheck",
}
HOLE = re.compile(r"\{\{\s*([^}]+?)\s*\}\}")


class Conv(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out: list[str] = []
        self.stack: list[str] = []          # closing text per open element
        self.scopes: list[dict] = []        # loop variable scopes
        self.loop_n = 0
        self.skip = 0                       # inside <helmet>

    # --- holes -------------------------------------------------------------------------
    def resolve(self, path: str) -> str:
        path = path.strip()
        if path in ("true", "false") or re.fullmatch(r"-?\d+(\.\d+)?", path):
            return path
        head, _, rest = path.partition(".")
        for sc in reversed(self.scopes):
            if head in sc:
                return sc[head] + (("." + rest) if rest else "")
        return "v." + path

    def expr(self, raw: str) -> str:
        """attribute value -> JS expression"""
        m = HOLE.fullmatch(raw.strip()) if raw is not None else None
        if m:
            return self.resolve(m.group(1))
        if raw is None:
            return "true"
        if HOLE.search(raw):
            parts, pos = [], 0
            for h in HOLE.finditer(raw):
                parts.append(raw[pos:h.start()].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${"))
                parts.append("${" + self.resolve(h.group(1)) + "}")
                pos = h.end()
            parts.append(raw[pos:].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${"))
            return "`" + "".join(parts) + "`"
        return json.dumps(raw, ensure_ascii=False)

    # --- tags --------------------------------------------------------------------------
    def handle_starttag(self, tag, attrs):
        if tag == "helmet":
            self.skip += 1
            return
        if self.skip:
            return
        a = dict(attrs)
        if tag == "x-dc":
            self.stack.append("")
            return
        if tag == "sc-if":
            self.out.append("{(" + self.expr(a.get("value")) + ") && (<>")
            self.stack.append("</>)}")
            return
        if tag == "sc-for":
            self.loop_n += 1
            var, idx = a.get("as", "item"), f"i{self.loop_n}"
            self.out.append("{(" + self.expr(a.get("list")) + " || []).map((" + var + ", " + idx + ") => (<React.Fragment key={" + idx + "}>")
            self.scopes.append({var: var, "$index": idx})
            self.stack.append("</React.Fragment>))}")
            return
        parts = []
        for k, val in attrs:
            if k.startswith("hint-"):
                continue
            name = ATTR.get(k, k)
            if name == "style":
                parts.append("style={css(" + self.expr(val) + ")}")
            else:
                e = self.expr(val)
                parts.append(f"{name}={{{e}}}" if not e.startswith('"') else f"{name}={e}")
        open_ = "<" + tag + ((" " + " ".join(parts)) if parts else "")
        if tag in VOID:
            self.out.append(open_ + " />")
            return
        self.out.append(open_ + ">")
        self.stack.append("</" + tag + ">")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID and not self.skip:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if tag == "helmet":
            self.skip -= 1
            return
        if self.skip or tag in VOID:
            return
        if tag == "sc-for":
            self.scopes.pop()
        self.out.append(self.stack.pop())

    def handle_data(self, data):
        if self.skip:
            return
        if not data.strip():
            self.out.append(" " if "\n" not in data else "\n")
            return
        res, pos = [], 0
        for h in HOLE.finditer(data):
            res.append(self.text(data[pos:h.start()]))
            res.append("{" + self.resolve(h.group(1)) + "}")
            pos = h.end()
        res.append(self.text(data[pos:]))
        self.out.append("".join(res))

    @staticmethod
    def text(t: str) -> str:
        return t.replace("{", "{'{'}").replace("}", "{'}'}").replace("<", "&lt;").replace(">", "&gt;")


def convert(src: str) -> tuple[str, str]:
    body = src.split("<x-dc>", 1)[1].split("</x-dc>", 1)[0]
    style = re.search(r"<style>(.*?)</style>", body, re.S).group(1)
    script = re.search(r"data-dc-script[^>]*>(.*?)</script>", src, re.S).group(1)
    # the design is drawn at phone size; on a real phone the app fills the screen
    body = body.replace("width: 390px; height: 844px; position: relative; overflow: hidden;",
                        "width: 100%; max-width: 520px; height: 100dvh; margin: 0 auto; position: relative; overflow: hidden;", 1)
    c = Conv()
    c.feed("<x-dc>" + body + "</x-dc>")
    jsx = "".join(c.out).strip()
    cls = script.strip()
    cls = cls.replace("class Component extends DCLogic {", "class Component extends React.Component {", 1)
    assert cls.rstrip().endswith("}")
    cls = cls.rstrip()[:-1].rstrip() + "\n\n  render() {\n    const v = this.renderVals();\n    return (\n" + jsx + "\n    );\n  }\n}\n"
    app = ("// generated from the design file by tools/dc2jsx.py — edit the design, then re-run\n"
           "import React from 'react';\nimport { css } from './css.js';\n\n" + cls + "\nexport default Component;\n")
    return app, style


if __name__ == "__main__":
    src = Path(sys.argv[1]).read_text(encoding="utf-8")
    out = Path(sys.argv[2])
    app, style = convert(src)
    (out / "App.jsx").write_text(app, encoding="utf-8")
    (out / "app.css").write_text(style.strip() + "\n", encoding="utf-8")
    print("wrote", out / "App.jsx", len(app), "chars")
