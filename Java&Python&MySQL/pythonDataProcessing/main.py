import pandas as pd
import re

tag = pd.read_csv('tag.csv')
ted = pd.read_csv('TED.csv')

taag = tag.values
teed = ted.values
for ta in taag:
    v = 0
    for t in teed:
        if t[1] == ta[0] and re.findall(ta[1].lower(), t[3]):
            v += int(t[2])
    ta[2] = v

taag = pd.DataFrame(taag, columns=["year1", "tag_name", "views"])
taag.to_csv('tag_f.csv')

