"""Build sa3arly-button.html: open it once and drag the button to the bookmarks bar."""
from pathlib import Path
from urllib.parse import quote

HERE = Path(__file__).parent


def build(out: Path) -> Path:
    js = (HERE / "bookmarklet.js").read_text(encoding="utf-8")
    js = "\n".join(l for l in js.splitlines() if not l.strip().startswith("//"))
    href = "javascript:" + quote(js, safe="(){}[];:=,.'!*+-/<>&|?$_ ")
    html = f"""<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>زرار سعرلي</title>
<style>body{{font:16px/1.7 system-ui;max-width:640px;margin:48px auto;padding:0 20px;color:#111}}
a.btn{{display:inline-block;background:#0f766e;color:#fff;padding:12px 26px;border-radius:10px;font-weight:700;
text-decoration:none;font-size:20px;margin:16px 0}}ol li{{margin:6px 0}}code{{background:#f1f5f9;padding:1px 6px;border-radius:4px}}</style>
</head><body><h1>زرار سعرلي</h1>
<p>اسحب الزرار ده بالماوس وحطه في شريط المفضلة (Bookmarks bar) فوق في المتصفح:</p>
<a class="btn" href="{href}">سعرلي</a>
<ol><li>لو شريط المفضلة مش ظاهر: <code>Ctrl+Shift+B</code>.</li>
<li>افتح صفحة نتايج على دوبيزل أو كونتاكت كارز أو فيسبوك ماركت بليس.</li>
<li>دوس <b>سعرلي</b> — هيتحفظ ملف في Downloads وتظهر رسالة بعدد الإعلانات.</li>
<li>قلّب الصفحة بنفسك ودوس تاني.</li>
<li>في الآخر في PowerShell: <code>py -m sa3arly import</code></li></ol>
<p>الزرار بيقرا الصفحة اللي إنت فاتحها بس، لما إنت تدوس — مش بيفتح ولا يقلّب حاجة لوحده.</p>
</body></html>"""
    out.write_text(html, encoding="utf-8")
    return out


if __name__ == "__main__":
    import sys
    print(build(Path(sys.argv[1] if len(sys.argv) > 1 else "sa3arly-button.html")))
