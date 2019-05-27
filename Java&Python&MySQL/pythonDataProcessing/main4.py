import pandas as pd
import numpy as np
import re

topics = pd.read_csv('topics.csv')
ted = pd.read_csv('TED.csv')

topics = topics.values
ted = ted.values

res = []
for topic in topics:
    topic = topic[0]
    entry = []
    views = 0
    for d in ted:
        if re.findall(topic.lower(), d[3]):
            views += int(d[2])
    sibs = []
    sibs_views = []
    for t in topics:
        t = t[0]
        com_view = 0
        for d in ted:
            if re.findall(topic.lower(), d[3]) and re.findall(t.lower(), d[3]) and topic != t:
                com_view += int(d[2])
        sibs.append(t)
        sibs_views.append(com_view)
    l1 = np.argsort(sibs_views)[-1]
    l2 = np.argsort(sibs_views)[-2]
    l3 = np.argsort(sibs_views)[-3]
    entry.append("All")
    entry.append(topic)
    entry.append(views)
    entry.append(sibs[l1])
    entry.append(sibs_views[l1])
    entry.append(sibs[l2])
    entry.append(sibs_views[l2])
    entry.append(sibs[l3])
    entry.append(sibs_views[l3])
    res.append(entry)

data = pd.DataFrame(res, columns=["year1", "tag_name", "views", "related topic1", "view_of_topic1",
                                         "related topic2", "view_of_topic2", "related topic3", "view_of_topic3"])
data.to_csv('all.csv')

