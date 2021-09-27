from IPython.display import HTML
from urllib import request
import json, io

def UI(df, outfile_path = "pivottableUI.html", **kwargs):
  try: pivottable.TEMPLATE
  except:
    with request.urlopen('https://aiaicafe.github.io/react-pivottable-template/') as url:
      pivottable.TEMPLATE = url.read().decode()

  with io.open(outfile_path, 'wt', encoding='utf8') as outfile:
    csv = df.to_csv(encoding='utf8')
    if hasattr(csv, 'decode'):
      csv = csv.decode('utf8')
    outfile.write(pivottable.TEMPLATE %
      dict(csv=csv, kwargs=json.dumps(kwargs)))
  return HTML(outfile_path)
